// Simplified queue - uses Redis if available, falls back to direct execution
import { generateTitle } from "@/lib/ai/openai";
import { prisma } from "@/lib/db/prisma";

// Simple in-memory queue fallback when Redis/BullMQ has issues
export async function enqueueGenerateTitle(conversationId: string, firstMessage: string) {
  // Fire and forget - don't await
  setTimeout(async () => {
    try {
      const title = await generateTitle(firstMessage);
      await prisma.conversation.update({
        where: { id: conversationId },
        data:  { title }
      });
    } catch (err) {
      console.error("[Queue] Failed to generate title:", err);
    }
  }, 1500);
}
