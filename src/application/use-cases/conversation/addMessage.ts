import { Conversation } from "@/src/domain/entities";
import type { IConversationRepository } from "@/src/application/ports/data-access";
import type { IIdService, IAiService } from "@/src/application/ports/services";
import { MessageRole } from "@/src/domain/enums";
import { JwtUser } from "@/src/application/use-cases/user/user.types";

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
      const summary = await this.aiService.createTitle(message);
      Object.assign(updatePayload, { summary });
    }

    // Limit the conversation to 10 messages. 10th message being the summary from the AI service
    if (conversation.messages.length >= 9) {
      Object.assign(updatePayload, { finished: true });
      await this;
    }

    if (Object.keys(updatePayload).length > 0) {
      await this.conversationRepo.update(conversationId, updatePayload);
      Object.assign(conversation, updatePayload);
    }

    await this.conversationRepo.addMessage(conversationId, {
      id: this.idService.generateId(),
      role: MessageRole.User,
      messageText: message,
    });

    return conversation;
  }
}
