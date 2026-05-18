import type { IConversationRepository } from "@/src/application/ports/data-access";
import { ConversationListItem } from "./conversation.types";

export default class ListConversations {
  constructor(protected conversationRepo: IConversationRepository) {}

  async execute(userId: string): Promise<ConversationListItem[]> {
    const conversations: ConversationListItem[] =
      await this.conversationRepo.listTitles(userId);

    return conversations;
  }
}
