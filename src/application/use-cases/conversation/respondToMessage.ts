import { Conversation } from "@/src/domain/entities";
import type { IConversationRepository } from "@/src/application/ports/data-access";
import type { IIdService, IAiService } from "@/src/application/ports/services";
import { GeneratedMessageResponse } from "./conversation.types";
import { MessageRole } from "@/src/domain/enums";
import ExternalError from "../../errors/external";

export default class RespondToMessage {
  constructor(
    protected conversationRepo: IConversationRepository,
    protected idService: IIdService,
    protected aiService: IAiService,
  ) {}

  async execute(conversation: Conversation): Promise<ReadableStream<string>> {
    try {
      const { stream, onFinished }: GeneratedMessageResponse =
        await this.aiService.streamResponse(
          conversation.messages,
          conversation.finished,
        );

      onFinished
        .then(async (fullMessage: string) => {
          await this.conversationRepo.addMessage(conversation.id, {
            id: this.idService.generateId(),
            role: MessageRole.Assistant,
            messageText: fullMessage,
          });
        })
        .catch((err: Error) =>
          console.error("Failed to save AI response to DB", err),
        );

      return stream;
    } catch (err) {
      await this.conversationRepo.addMessage(conversation.id, {
        id: this.idService.generateId(),
        role: MessageRole.System,
        messageText: (err as Error).message,
      });
      throw new ExternalError((err as Error).message);
    }
  }
}
