import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { streamChatCompletion } from "@/lib/ai/openai";
import { cache, CACHE_KEYS } from "@/lib/redis/client";
import { enqueueGenerateTitle } from "@/lib/queue/workers";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  conversationId: z.string().optional(),
  message:        z.string().min(1).max(32000),
  model:          z.string().optional().default("gpt-4o-mini"),
  temperature:    z.number().min(0).max(2).optional().default(0.7),
  maxTokens:      z.number().min(1).max(4096).optional().default(2048),
  systemPrompt:   z.string().optional()
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Rate limit: 30 requests/min
    const rl = await cache.rateLimit(CACHE_KEYS.rateLimit(session.user.id), 30, 60000);
    if (!rl.success) return NextResponse.json({ error: "Rate limit exceeded. Please wait." }, { status: 429 });

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

    const { conversationId: existingId, message, model, temperature, maxTokens, systemPrompt } = parsed.data;

    // Get or create conversation
    let conversation = existingId
      ? await prisma.conversation.findFirst({ where: { id: existingId, userId: session.user.id } })
      : null;

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { userId: session.user.id, model: model ?? "gpt-4o-mini", systemPrompt }
      });
    }

    // Save user message
    await prisma.message.create({
      data: { conversationId: conversation.id, role: "user", content: message }
    });

    // Get history (last 20)
    const history = await prisma.message.findMany({
      where:   { conversationId: conversation.id },
      orderBy: { createdAt: "desc" },
      take:    20
    });
    const historyMessages = history.reverse().map(m => ({
      role: m.role as "user" | "assistant",
      content: m.content
    }));

    // Generate title for new conversations
    if (history.length <= 1) {
      enqueueGenerateTitle(conversation.id, message);
    }

    // Stream AI response
    const convId = conversation.id;
    const enc = new TextEncoder();
    let fullContent = "";

    const aiStream = await streamChatCompletion({
      model, messages: historyMessages, temperature, maxTokens, systemPrompt
    });

    const stream = new ReadableStream({
      async start(ctrl) {
        // First chunk: send conversationId
        ctrl.enqueue(enc.encode(`data: ${JSON.stringify({ conversationId: convId })}\n\n`));

        const reader = aiStream.getReader();
        const dec    = new TextDecoder();
        let   buf    = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buf += dec.decode(value, { stream: true });
          const lines = buf.split("\n");
          buf = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) fullContent += data.content;
              ctrl.enqueue(enc.encode(line + "\n\n"));

              if (data.done) {
                // Save assistant message to DB
                prisma.message.create({
                  data: { conversationId: convId, role: "assistant", content: fullContent }
                }).then(() => {
                  cache.del(CACHE_KEYS.conversations(session.user.id));
                  cache.del(CACHE_KEYS.stats(session.user.id));
                }).catch(console.error);
              }
            } catch { /* ignore parse errors */ }
          }
        }
        ctrl.close();
      }
    });

    return new Response(stream, {
      headers: {
        "Content-Type":  "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection":    "keep-alive"
      }
    });
  } catch (err) {
    console.error("[Chat API]", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
