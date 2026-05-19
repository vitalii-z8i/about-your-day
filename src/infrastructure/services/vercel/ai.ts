import {
  generateText,
  streamText,
  generateObject,
  isReasoningUIPart,
} from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import type { IAiService } from "@/src/application/ports/services/IAiService";
import type { Message } from "@/src/domain/entities";
import type { GeneratedMessageResponse } from "@/src/application/use-cases/conversation/conversation.types";
import { MessageRole } from "@/src/domain/enums";
import { ExternalError } from "@/src/application/errors";

type AIError = {
  error: {
    data: {
      error: {
        type: string;
        message: string;
      };
    };
  };
};
const HAIKU = anthropic("claude-haiku-4-5");
const SONNET = anthropic("claude-sonnet-4-6");

function toSdkMessages(messages: Message[]) {
  return messages
    .filter((m) => m.role !== MessageRole.System)
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.messageText,
    }));
}

const SYSTEM_ONGOING = `You are a warm, empathetic journaling companion helping someone reflect on their day.
Ask one thoughtful follow-up question at a time. Be curious and gentle. Keep responses concise.`;

const SYSTEM_CLOSING = `You are a warm, empathetic journaling companion. The conversation has reached its end.
Write a brief heartfelt closing — acknowledge what they shared and wish them rest.
Two or three sentences. Do not ask further questions.`;

const SYSTEM_EMOTIONS = `Analyze this journaling conversation and identify negative emotions the person expressed.
Return only emotions clearly present — do not infer. Return an empty list if none.`;

export class VercelAiService implements IAiService {
  async createTitle(message: string): Promise<string> {
    const { text } = await generateText({
      model: HAIKU,
      system:
        "Create a short title (max 40 characters) for this journal entry. Return only the title text.",
      prompt: message,
      maxOutputTokens: 20,
    });
    const trimmed = text.trim();
    return trimmed.length > 40 ? trimmed.slice(0, 37) + "..." : trimmed;
  }

  async streamResponse(
    messages: Message[],
    finished: boolean,
  ): Promise<GeneratedMessageResponse> {
    // 1. Pre-flight check: Make a tiny request to validate the key/connection
    try {
      await generateText({
        model: HAIKU,
        prompt: "ping",
        providerOptions: {
          anthropic: {
            isReasoningUIPart: "minimal",
          },
        },
      });
    } catch (error) {
      // If the API key is invalid, execution halts HERE
      throw new ExternalError(
        `AI authentication or connectivity failed: ${(error as Error).message}`,
      );
    }

    const result = streamText({
      model: HAIKU,
      system: finished ? SYSTEM_CLOSING : SYSTEM_ONGOING,
      messages: toSdkMessages(messages),
    });

    return {
      stream: result.textStream,
      onFinished: Promise.resolve(result.text),
    };
  }

  async extractNegativeEmotions(messages: Message[]): Promise<string[]> {
    const { object } = await generateObject({
      model: SONNET,
      system: SYSTEM_EMOTIONS,
      schema: z.object({ emotions: z.array(z.string()) }),
      messages: toSdkMessages(messages),
    });
    return object.emotions;
  }
}
