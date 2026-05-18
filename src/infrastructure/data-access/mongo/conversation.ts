import type { Conversation, Message } from "@/src/domain/entities";
import type { IConversationRepository } from "@/src/application/ports/data-access/IConversationRepository";
import type { ConversationListItem } from "@/src/application/use-cases/conversation/conversation.types";
import client from "./client";

type MessageDocument = Pick<Message, "id" | "messageText" | "role" | "createdAt"> & {
  metadata?: Record<string, string>;
};

type ConversationDocument = {
  _id: string;
  userId: string;
  finished: boolean;
  summary?: string;
  startedAt: Date;
  messages: MessageDocument[];
};

function toConversation(doc: ConversationDocument): Conversation {
  const { _id, ...rest } = doc;
  return { id: _id, ...rest };
}

export class MongoConversationRepository implements IConversationRepository {
  private get collection() {
    return client.db().collection<ConversationDocument>("conversations");
  }

  async listTitles(userId: string): Promise<ConversationListItem[]> {
    const docs = await this.collection
      .find({ userId }, { projection: { summary: 1, startedAt: 1 } })
      .sort({ startedAt: -1 })
      .toArray();
    return docs.map((doc) => ({ id: doc._id, summary: doc.summary, startedAt: doc.startedAt }));
  }

  async getOrCreate(conversationId: string, userId: string): Promise<Conversation> {
    const existing = await this.collection.findOne({ _id: conversationId });
    if (existing) return toConversation(existing);

    const doc: ConversationDocument = {
      _id: conversationId,
      userId,
      finished: false,
      startedAt: new Date(),
      messages: [],
    };
    await this.collection.insertOne(doc);
    return toConversation(doc);
  }

  async update(
    conversationId: string,
    payload: Partial<Pick<Conversation, "summary" | "finished">>,
  ): Promise<void> {
    await this.collection.updateOne({ _id: conversationId }, { $set: payload });
  }

  async addMessage(
    conversationId: string,
    message: Pick<Message, "id" | "role" | "messageText">,
  ): Promise<Message> {
    const full: Message = { ...message, createdAt: new Date() };
    await this.collection.updateOne(
      { _id: conversationId },
      { $push: { messages: full } },
    );
    return full;
  }

  async findById(conversationId: string): Promise<Conversation | undefined> {
    const doc = await this.collection.findOne({ _id: conversationId });
    return doc ? toConversation(doc) : undefined;
  }
}
