import type { Conversation, Message } from "@/src/domain/entities";
import type { IConversationRepository } from "@/src/application/ports/data-access/IConversationRepository";
import db from "@/lib/mock-db";
import { ConversationListItem } from "@/src/application/use-cases/conversation/conversation.types";

export class MockConversationRepository implements IConversationRepository {
  async listTitles(userId: string): Promise<ConversationListItem[]> {
    return db.conversations
      .filter((c) => c.userId === userId)
      .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())
      .map(({ id, summary, startedAt }) => ({ id, summary, startedAt }));
  }

  async getOrCreate(
    conversationId: string,
    userId: string,
  ): Promise<Conversation> {
    const existing = db.conversations.find((c) => c.id === conversationId);
    if (existing) return existing;
    const conv: Conversation = {
      id: conversationId,
      userId,
      finished: false,
      startedAt: new Date(),
      messages: [],
    };
    db.conversations.push(conv);
    return conv;
  }

  async update(
    conversationId: string,
    payload: Partial<Pick<Conversation, "summary" | "finished">>,
  ): Promise<void> {
    const conv = db.conversations.find((c) => c.id === conversationId);
    if (conv) Object.assign(conv, payload);
  }

  async addMessage(
    conversationId: string,
    message: Pick<Message, "id" | "role" | "messageText">,
  ): Promise<Message> {
    const conv = db.conversations.find((c) => c.id === conversationId);
    const full: Message = { ...message, createdAt: new Date() };
    conv?.messages.push(full);
    return full;
  }

  async findById(conversationId: string): Promise<Conversation | undefined> {
    return db.conversations.find((c) => c.id === conversationId);
  }
}
