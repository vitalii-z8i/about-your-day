import { Conversation } from "@/src/domain/entities";

export default class RespondToMessage {
  constructor(
    private findConversationUseCase: {
      execute: (conversationId: string) => Promise<Conversation>;
    },
    private respondUseCase: {
      execute: (conversation: Conversation) => Promise<ReadableStream<string>>;
    },
  ) {}

  async call(conversationId: string): Promise<ReadableStream<string>> {
    const conversation =
      await this.findConversationUseCase.execute(conversationId);

    return this.respondUseCase.execute(conversation);
  }
}
