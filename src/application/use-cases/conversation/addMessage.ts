import { Conversation } from "@/src/domain/entities";
import type { IConversationRepository } from "@/src/application/ports/data-access";
import type { IIdService, IAiService } from "@/src/application/ports/services";
import { MessageRole } from "@/src/domain/enums";
import { JwtUser } from "@/src/application/use-cases/user/user.types";
import { ConversationError } from "../../errors";

export default class AddMessage {
  constructor(
    protected conversationRepo: IConversationRepository,
    protected idService: IIdService,
    protected aiService: IAiService,
  ) {}

  async execute(
    user: JwtUser,
    conversationId: string,
    message: string,
  ): Promise<Conversation> {
    const conversation: Conversation = await this.conversationRepo.getOrCreate(
      conversationId,
      user.id,
    );

    const updatePayload = {};
    if (!conversation.summary) {
      try {
        const summary = await this.aiService.createTitle(message);
        Object.assign(updatePayload, { summary });
      } catch (err) {
        console.error("AI service error:", err);
        const summary = `${message.substring(0, 10)}...`;
        Object.assign(updatePayload, { summary });
      }
    }

    const conversationIsOld =
      Date.now() - conversation.startedAt.getTime() > 8.64e7;
    if (conversation.finished || conversationIsOld) {
      throw new ConversationError("Conversation is already finished");
    }

    // Limit the conversation to 11 messages.
    // 11th message being the summary from the AI service
    if (conversation.messages.length >= 10) {
      Object.assign(updatePayload, { finished: true });
    }

    if (Object.keys(updatePayload).length > 0) {
      await this.conversationRepo.update(conversationId, updatePayload);
      Object.assign(conversation, updatePayload);
    }

    conversation.messages.push(
      await this.conversationRepo.addMessage(conversationId, {
        id: this.idService.generateId(),
        role: MessageRole.User,
        messageText: message,
      }),
    );

    return conversation;
  }
}
