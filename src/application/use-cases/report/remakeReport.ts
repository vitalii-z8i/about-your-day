import { NoRecordError } from "../../errors";
import type { IConversationRepository, IReportRepository } from "@/src/application/ports/data-access";
import type { IAiService } from "@/src/application/ports/services";

export default class RemakeReport {
  constructor(
    protected conversationRepo: IConversationRepository,
    protected reportRepo: IReportRepository,
    protected aiService: IAiService,
  ) {}

  async execute(conversationId: string): Promise<void> {
    const conversation = await this.conversationRepo.findById(conversationId);
    if (!conversation) throw new NoRecordError("Conversation was not found");

    const report = await this.reportRepo.fetchReport(conversationId);
    if (!report) throw new NoRecordError("Report was not found");

    const negativeEmotions = await this.aiService.extractNegativeEmotions(
      conversation.messages,
    );

    await this.reportRepo.updateReport(report.id, { negativeEmotions });
  }
}
