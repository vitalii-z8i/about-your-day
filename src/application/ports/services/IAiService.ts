import { Message } from "@/src/domain/entities";
import { GeneratedMessageResponse } from "../../use-cases/conversation/conversation.types";

export interface IAiService {
  createTitle(message: string): Promise<string>;
  streamResponse(
    messages: Message[],
    finished: boolean,
  ): Promise<GeneratedMessageResponse>;
  extractNegativeEmotions(messages: Message[]): Promise<string[]>;
}
