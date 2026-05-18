"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { Message } from "@/src/domain/entities";
import type { Conversation } from "@/src/domain/entities";
import MessageInput from "./message-input";

type Props = {
  chatId: string;
  userName: string;
  conversation: Conversation | null;
};

type LocalMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  text: string;
};

function toLocal(m: Message): LocalMessage {
  return {
    id: m.id,
    role: m.role as "user" | "assistant",
    text: m.messageText,
  };
}

function buildInitialMessages(
  conversation: Conversation | null,
): LocalMessage[] {
  if (!conversation) return [];
  const msgs = conversation.messages.map(toLocal);
  if (conversation.finished) {
    msgs.push({
      id: "system-finished",
      role: "system",
      text: "This conversation is finished",
    });
  } else if (Date.now() - conversation.startedAt.getTime() > 8.64e7) {
    msgs.push({
      id: "system-expired",
      role: "system",
      text: "This conversation is about one of the past days. Start a new chat to tell about your day today",
    });
  }
  return msgs;
}

export default function ChatWindow({ chatId, userName, conversation }: Props) {
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<LocalMessage[]>(
    buildInitialMessages(conversation),
  );
  const [streamingText, setStreamingText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isFinished, setIsFinished] = useState(conversation?.finished ?? false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  async function sendMessage(text: string) {
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", text },
    ]);
    setIsStreaming(true);
    setStreamingText("");

    try {
      const msgRes = await fetch(`/api/conversations/${chatId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const updatedConversation = await msgRes.json();
      const conversationFinished = Boolean(updatedConversation.finished);

      const streamRes = await fetch(`/api/conversations/${chatId}/stream`);
      if (!streamRes.body) throw new Error("No stream body");

      const reader = streamRes.body.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        full += chunk;
        setStreamingText(full);
      }

      setMessages((prev) => {
        const next: LocalMessage[] = [
          ...prev,
          { id: crypto.randomUUID(), role: "assistant", text: full },
        ];
        if (conversationFinished) {
          next.push({
            id: "system-finished",
            role: "system",
            text: "This conversation is finished",
          });
        }
        return next;
      });
      setStreamingText("");
      if (conversationFinished) setIsFinished(true);
      router.refresh();
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: "Something went wrong. Please try again.",
        },
      ]);
      setStreamingText("");
    } finally {
      setIsStreaming(false);
    }
  }

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {isEmpty && (
            <div className="flex justify-start">
              <div className="max-w-[80%] px-4 py-3 rounded-2xl rounded-tl-sm bg-white text-stone-900 text-sm leading-relaxed">
                Hi {userName}, how was your day?
              </div>
            </div>
          )}

          {messages.map((m) => {
            if (m.role === "system") {
              return (
                <div key={m.id} className="flex justify-center py-2">
                  <span className="text-xs text-stone-400">{m.text}</span>
                </div>
              );
            }
            return (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-stone-900 text-white rounded-tr-sm"
                      : "bg-white text-stone-900 rounded-tl-sm"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            );
          })}

          {isStreaming && streamingText && (
            <div className="flex justify-start">
              <div className="max-w-[80%] px-4 py-3 rounded-2xl rounded-tl-sm bg-white text-stone-900 text-sm leading-relaxed">
                {streamingText}
                <span className="inline-block w-1 h-3.5 bg-stone-400 ml-0.5 animate-pulse rounded-sm" />
              </div>
            </div>
          )}

          {isStreaming && !streamingText && (
            <div className="flex justify-start">
              <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white">
                <span className="flex gap-1 items-center h-4">
                  <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      <div className="px-4 pb-6 pt-2">
        <div className="max-w-2xl mx-auto">
          <MessageInput
            onSend={sendMessage}
            disabled={isStreaming || isFinished}
          />
        </div>
      </div>
    </div>
  );
}
