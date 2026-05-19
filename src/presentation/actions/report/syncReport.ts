import type { Conversation } from "@/src/domain/entities";

export default class SyncReport {
  constructor(
    private authenticateUser: {
      execute: (token: string) => Promise<unknown>;
    },
    private findConversationUseCase: {
      execute: (conversationId: string) => Promise<Conversation>;
    },
    private prepareReportUseCase: {
      execute: (conversationId: string) => Promise<void>;
    },
    private remakeReportUseCase: {
      execute: (conversationId: string) => Promise<void>;
    },
  ) {}

  async call(token: string, conversationId: string): Promise<void> {
    await this.authenticateUser.execute(token);
    const conversation = await this.findConversationUseCase.execute(conversationId);

    if (conversation.reportId) {
      await this.remakeReportUseCase.execute(conversationId);
    } else {
      await this.prepareReportUseCase.execute(conversationId);
    }
  }
}
