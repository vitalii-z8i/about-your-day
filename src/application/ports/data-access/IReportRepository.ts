import { ConversationReport } from "@/src/domain/entities";

export interface IReportRepository {
  create(report: ConversationReport): Promise<void>;
  fetchReport(conversationId: string): Promise<ConversationReport | undefined>;
  updateReport(id: string, payload: Partial<Pick<ConversationReport, "negativeEmotions">>): Promise<void>;
}
