import type { Message } from "@/src/domain/entities";
import type { GeneratedMessageResponse } from "@/src/application/use-cases/conversation/conversation.types";

const FOLLOW_UP_RESPONSES = [
  "That sounds like quite a day. What part of it stood out to you the most?",
  "I hear you. How did that situation make you feel in the moment?",
  "Thanks for sharing that. Was there anything that surprised you about how things unfolded?",
  "It sounds like a lot happened. What's still on your mind right now?",
  "That's interesting. Did you have a chance to take a breath for yourself at any point today?",
];

const CLOSING_RESPONSE =
  "It sounds like you've had a full and meaningful day. Thank you for sharing it with me — I hope you can rest well tonight.";

function pickResponse(messages: Message[]): string {
  const userMessages = messages.filter((m) => m.role === "user");
  const index = (userMessages.length - 1) % FOLLOW_UP_RESPONSES.length;
  return FOLLOW_UP_RESPONSES[index];
}

function createStream(text: string): GeneratedMessageResponse {
  const words = text.split(" ");
  const delayMs = 40;

  const stream = new ReadableStream<string>({
    async start(controller) {
      for (let i = 0; i < words.length; i++) {
        controller.enqueue((i === 0 ? "" : " ") + words[i]);
        await new Promise((r) => setTimeout(r, delayMs));
      }
      controller.close();
    },
  });

  // Text is static — resolve after stream is expected to finish
  const onFinished = new Promise<string>((resolve) => {
    setTimeout(() => resolve(text), words.length * delayMs + 100);
  });

  return { stream, onFinished };
}

export class MockAiService {
  async createTitle(message: string): Promise<string> {
    await new Promise((r) => setTimeout(r, 50));
    const trimmed = message.trim();
    return trimmed.length > 40 ? trimmed.slice(0, 37) + "..." : trimmed;
  }

  async streamResponse(
    messages: Message[],
    finished: boolean
  ): Promise<GeneratedMessageResponse> {
    const text = finished ? CLOSING_RESPONSE : pickResponse(messages);
    return createStream(text);
  }

  async extractNegativeEmotions(messages: Message[]): Promise<string[]> {
    void messages;
    return ["stress", "frustration"];
  }
}
