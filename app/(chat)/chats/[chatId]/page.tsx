import { getCurrentUser } from "@/lib/auth";
import { container } from "@/src/infrastructure/composition/container";
import ChatWindow from "@/components/chat/chat-window";
import type { Conversation } from "@/src/domain/entities";
import NoRecordError from "@/src/application/errors/noRecord";
import { redirect } from "next/navigation";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { chatId } = await params;

  let conversation: Conversation | null = null;
  try {
    conversation = await container.conversation.find().execute(chatId);
  } catch (err) {
    if (!(err instanceof NoRecordError)) throw err;
    // New conversation — render empty chat
  }

  return (
    <ChatWindow
      chatId={chatId}
      userName={user.name}
      conversation={conversation}
    />
  );
}
