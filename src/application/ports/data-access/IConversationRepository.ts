import { Conversation, Message } from "@/src/domain/entities";
import type { ConversationListItem } from "@/src/application/use-cases/conversation/conversation.types";

export interface IConversationRepository {
  listTitles(userId: string): Promise<ConversationListItem[]>;
  getOrCreate(conversationId: string, userId: string): Promise<Conversation>;
  update(conversationId: string, payload: Partial<Pick<Conversation, "summary" | "finished">>): Promise<void>;
  addMessage(conversationId: string, message: Pick<Message, "id" | "role" | "messageText">): Promise<Message>;
  findById(conversationId: string): Promise<Conversation | undefined>;
}
