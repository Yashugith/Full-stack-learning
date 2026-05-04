import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { cache, CACHE_KEYS } from "@/lib/redis/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const cached = await cache.get(CACHE_KEYS.stats(session.user.id));
    if (cached) return NextResponse.json(cached);

    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [totalConversations, totalMessages, conversationsThisWeek, messagesThisWeek] = await Promise.all([
      prisma.conversation.count({ where: { userId: session.user.id } }),
      prisma.message.count({ where: { conversation: { userId: session.user.id } } }),
      prisma.conversation.count({ where: { userId: session.user.id, createdAt: { gte: weekAgo } } }),
      prisma.message.count({ where: { conversation: { userId: session.user.id }, createdAt: { gte: weekAgo } } })
    ]);

    const stats = { totalConversations, totalMessages, conversationsThisWeek, messagesThisWeek };
    cache.set(CACHE_KEYS.stats(session.user.id), stats, 300);

    return NextResponse.json(stats);
  } catch (err) {
    console.error("[Stats]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
