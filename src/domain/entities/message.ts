import { MessageRole } from "../enums";

export type Message = {
  id: string;
  messageText: string;
  role: MessageRole;
  createdAt: Date;
  metadata?: Record<string, string>;
};
