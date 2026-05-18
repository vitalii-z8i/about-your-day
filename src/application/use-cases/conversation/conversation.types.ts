import { Conversation } from "@/src/domain/entities";

export type MessageDTO = {
  conversationId: string;
  message: string;
};

export type ConversationListItem = Pick<
  Conversation,
  "id" | "summary" | "startedAt"
>;

export type GeneratedMessageResponse = {
  stream: ReadableStream<string>;
  onFinished: Promise<string>;
};
