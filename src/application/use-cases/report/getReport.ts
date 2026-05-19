import { NoRecordError } from "../../errors";
import type { IReportRepository } from "@/src/application/ports/data-access";
import type { ConversationReport } from "@/src/domain/entities";

export default class GetReport {
  constructor(protected reportRepo: IReportRepository) {}

  async execute(conversationId: string): Promise<ConversationReport> {
    const report = await this.reportRepo.fetchReport(conversationId);
    if (!report) throw new NoRecordError("Report was not found");
    return report;
  }
}
