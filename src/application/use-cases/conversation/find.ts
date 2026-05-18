import { Conversation } from "@/src/domain/entities";
import { NoRecordError } from "../../errors";
import type { IConversationRepository } from "@/src/application/ports/data-access";

export default class FindConversation {
  constructor(protected conversationRepo: IConversationRepository) {}

  async execute(conversationId: string): Promise<Conversation> {
    const conversation = await this.conversationRepo.findById(conversationId);
    if (!conversation) throw new NoRecordError("Conversation was not found");

    return conversation;
  }
}
