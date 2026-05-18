import { ConversationReport } from "@/src/domain/entities";

export interface IReportRepository {
  create(report: ConversationReport): Promise<void>;
}
