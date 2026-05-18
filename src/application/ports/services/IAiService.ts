import { Message } from "@/src/domain/entities";
import type { NewMessageResponse } from "@/src/application/use-cases/conversation/conversation.types";

export interface IAiService {
  createTitle(message: string): Promise<string>;
  streamResponse(messages: Message[], finished: boolean): Promise<NewMessageResponse>;
  extractNegativeEmotions(messages: Message[]): Promise<string[]>;
}
