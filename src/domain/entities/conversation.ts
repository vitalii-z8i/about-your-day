import { Message } from "./message";

export type Conversation = {
  id: string;
  userId: string;
  finished: boolean;
  summary?: string;
  startedAt: Date;
  messages: Message[];
};
