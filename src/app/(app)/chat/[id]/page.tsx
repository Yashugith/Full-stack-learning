import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import { ChatInterface } from "@/components/chat/chat-interface";
import type { ChatMessage } from "@/types";

export default async function ChatPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const conversation = await prisma.conversation.findFirst({
    where:   { id: params.id, userId: session.user.id },
    include: { messages: { orderBy: { createdAt: "asc" } } }
  });

  if (!conversation) redirect("/chat");

  const initialMessages: ChatMessage[] = conversation.messages.map(m => ({
    id:        m.id,
    role:      m.role as "user" | "assistant",
    content:   m.content,
    createdAt: m.createdAt
  }));

  return <ChatInterface conversationId={params.id} initialMessages={initialMessages} />;
}
