import type { ConversationReport } from "@/src/domain/entities";

export default class GetReportAction {
  constructor(
    private authenticateUser: {
      execute: (token: string) => Promise<unknown>;
    },
    private getReportUseCase: {
      execute: (conversationId: string) => Promise<ConversationReport>;
    },
  ) {}

  async call(token: string, conversationId: string): Promise<ConversationReport> {
    await this.authenticateUser.execute(token);
    return this.getReportUseCase.execute(conversationId);
  }
}
