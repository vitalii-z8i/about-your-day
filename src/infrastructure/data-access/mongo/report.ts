import type { ConversationReport } from "@/src/domain/entities";
import type { IReportRepository } from "@/src/application/ports/data-access";
import client from "./client";

type ReportDocument = {
  _id: string;
  conversationId: string;
  userId: string;
  negativeEmotions: string[];
};

function toReport(doc: ReportDocument): ConversationReport {
  const { _id, ...rest } = doc;
  return { id: _id, ...rest };
}

export class MongoReportRepository implements IReportRepository {
  private get collection() {
    return client.db().collection<ReportDocument>("reports");
  }

  async create(report: ConversationReport): Promise<void> {
    await this.collection.insertOne({
      _id: report.id,
      conversationId: report.conversationId,
      userId: report.userId,
      negativeEmotions: report.negativeEmotions,
    });
  }

  async fetchReport(conversationId: string): Promise<ConversationReport | undefined> {
    const doc = await this.collection.findOne({ conversationId });
    return doc ? toReport(doc) : undefined;
  }

  async updateReport(
    id: string,
    payload: Partial<Pick<ConversationReport, "negativeEmotions">>,
  ): Promise<void> {
    await this.collection.updateOne({ _id: id }, { $set: payload });
  }
}
