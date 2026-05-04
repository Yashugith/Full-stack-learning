import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { cache, CACHE_KEYS } from "@/lib/redis/client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const pageSize = parseInt(searchParams.get("pageSize") ?? "20");
    const search   = searchParams.get("search") ?? "";

    if (!search) {
      const cached = await cache.get(CACHE_KEYS.conversations(session.user.id));
      if (cached) return NextResponse.json(cached);
    }

    const [conversations, total] = await Promise.all([
      prisma.conversation.findMany({
        where: {
          userId: session.user.id,
          archived: false,
          ...(search ? { title: { contains: search, mode: "insensitive" } } : {})
        },
        include: { messages: { orderBy: { createdAt: "desc" }, take: 1 } },
        orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
        take: pageSize
      }),
      prisma.conversation.count({ where: { userId: session.user.id, archived: false } })
    ]);

    const response = { data: conversations, total, hasMore: conversations.length < total };
    if (!search) cache.set(CACHE_KEYS.conversations(session.user.id), response, 300);

    return NextResponse.json(response);
  } catch (err) {
    console.error("[Conversations GET]", err);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await prisma.conversation.deleteMany({ where: { id, userId: session.user.id } });
    cache.del(CACHE_KEYS.conversations(session.user.id));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
