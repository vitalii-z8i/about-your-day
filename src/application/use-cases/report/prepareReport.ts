import { NoRecordError } from "../../errors";
import type { IConversationRepository, IReportRepository } from "@/src/application/ports/data-access";
import type { IIdService, IAiService } from "@/src/application/ports/services";

export default class PrepareReport {
  constructor(
    protected conversationRepo: IConversationRepository,
    protected reportRepo: IReportRepository,
    protected idService: IIdService,
    protected aiService: IAiService,
  ) {}

  async execute(conversationId: string): Promise<void> {
    const conversation = await this.conversationRepo.findById(conversationId);
    if (!conversation) throw new NoRecordError("Conversation was not found");

    const negativeEmotions = await this.aiService.extractNegativeEmotions(
      conversation.messages,
    );

    const reportId = this.idService.generateId();
    await this.reportRepo.create({
      id: reportId,
      conversationId,
      userId: conversation.userId,
      negativeEmotions,
    });

    await this.conversationRepo.update(conversationId, { reportId });
  }
}
