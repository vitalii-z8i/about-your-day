"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type {
  Message,
  Conversation,
  ConversationReport,
} from "@/src/domain/entities";
import MessageInput from "./message-input";
import { MessageRole } from "@/src/domain/enums";

type Props = {
  chatId: string;
  userName: string;
  conversation: Conversation | null;
};

export default function ChatWindow({ chatId, userName, conversation }: Props) {
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [isFinished, setIsFinished] = useState(conversation?.finished ?? false);

  const [messages, setMessages] = useState<Message[]>(() => {
    if (!conversation) return [];
    const msgs = [...conversation.messages];
    if (conversation.finished) {
      msgs.push({
        id: "system-finished",
        role: MessageRole.System,
        messageText: "This conversation is finished",
        createdAt: new Date(),
      });
    } else if (Date.now() - conversation.startedAt.getTime() > 8.64e7) {
      setIsFinished(true);
      msgs.push({
        id: "system-expired",
        role: MessageRole.System,
        messageText:
          "This conversation is about one of the past days. Start a new chat to tell about your day today",
        createdAt: new Date(),
      });
    }
    return msgs;
  });
  const [streamingText, setStreamingText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [reportId, setReportId] = useState(conversation?.reportId);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [report, setReport] = useState<ConversationReport | null>(null);
  const [isLoadingReport, setIsLoadingReport] = useState(false);

  if (conversation?.reportId && conversation.reportId !== reportId) {
    setReportId(conversation.reportId);
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  async function openReport() {
    setIsReportOpen(true);
    if (report) return;
    setIsLoadingReport(true);
    try {
      const res = await fetch(`/api/reports/${chatId}`);
      if (!res.ok) throw new Error("Failed to fetch report");
      setReport(await res.json());
    } catch {
      // keep panel open, show nothing
    } finally {
      setIsLoadingReport(false);
    }
  }

  async function syncReport() {
    const res = await fetch(`/api/reports/${chatId}`, { method: "POST" });
    if (res.ok) {
      setReportId(chatId);
      setReport(null);
    }
  }

  async function sendMessage(text: string) {
    try {
      setIsReportOpen(false);

      const msgRes = await fetch(`/api/conversations/${chatId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const updatedConversation = await msgRes.json();
      setMessages((prev) => [...prev, updatedConversation.messages.at(-1)]);
      setIsStreaming(true);
      setStreamingText("");

      const conversationFinished = Boolean(updatedConversation.finished);

      // fire report sync in parallel with the AI stream
      const reportSyncPromise = syncReport();

      const streamRes = await fetch(`/api/conversations/${chatId}/stream`);
      if (!streamRes.body) throw new Error("No stream body");
      if (!streamRes.ok) throw new Error((await streamRes.json()).error);

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

      await reportSyncPromise;

      const aiMsg: Message = {
        id: crypto.randomUUID(),
        role: MessageRole.Assistant,
        messageText: full,
        createdAt: new Date(),
      };
      setMessages((prev) => {
        const next: Message[] = [...prev, aiMsg];
        if (conversationFinished) {
          next.push({
            id: "system-finished",
            role: MessageRole.System,
            messageText: "This conversation is finished",
            createdAt: new Date(),
          });
        }
        return next;
      });
      setStreamingText("");
      if (conversationFinished) setIsFinished(true);
      router.refresh();
    } catch (err) {
      console.error(err);
      const errMsg: Message = {
        id: crypto.randomUUID(),
        role: MessageRole.System,
        messageText:
          (err as Error)?.message || "Something went wrong. Please try again.",
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
      setStreamingText("");
    } finally {
      setIsStreaming(false);
    }
  }

  const isEmpty = messages.length === 0;
  const nonSystemMessageCount = messages.filter(
    (m) => m.role !== MessageRole.System,
  ).length;
  const canMakeReport = !reportId && nonSystemMessageCount > 3;
  const [isSyncingReport, setIsSyncingReport] = useState(false);

  async function handleMakeReport() {
    setIsSyncingReport(true);
    try {
      await syncReport();
    } finally {
      setIsSyncingReport(false);
    }
  }

  return (
    <div className="flex h-full">
      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header bar with report button */}
        {(reportId || canMakeReport) && (
          <div className="flex justify-end px-4 pt-3 pb-0">
            <div className="max-w-2xl w-full mx-auto flex justify-end">
              {reportId ? (
                <button
                  onClick={openReport}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg border border-stone-200 text-stone-600 hover:border-stone-300 hover:text-stone-900 transition-colors"
                  style={{
                    color: isReportOpen ? "#4a6741" : undefined,
                    borderColor: isReportOpen ? "#4a6741" : undefined,
                  }}
                >
                  View report
                </button>
              ) : (
                <button
                  onClick={handleMakeReport}
                  disabled={isSyncingReport}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg border border-stone-200 text-stone-600 hover:border-stone-300 hover:text-stone-900 transition-colors disabled:opacity-50"
                >
                  {isSyncingReport ? "Making report…" : "Make report"}
                </button>
              )}
            </div>
          </div>
        )}

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
              if (m.role === MessageRole.System) {
                return (
                  <div key={m.id} className="flex justify-center py-2">
                    <span className="text-xs text-stone-400">
                      {m.messageText}
                    </span>
                  </div>
                );
              }
              return (
                <div
                  key={m.id}
                  className={`flex ${m.role === MessageRole.User ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      m.role === MessageRole.User
                        ? "bg-stone-900 text-white rounded-tr-sm"
                        : "bg-white text-stone-900 rounded-tl-sm"
                    }`}
                  >
                    {m.messageText}
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

      {/* Report sidebar */}
      {isReportOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-40 md:hidden"
            onClick={() => setIsReportOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 z-50 md:relative md:inset-auto md:z-auto w-80 border-l border-stone-200 bg-white flex flex-col shrink-0">
          <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200">
            <span className="text-sm font-medium text-stone-900 tracking-tight">
              Day report
            </span>
            <button
              onClick={() => setIsReportOpen(false)}
              className="text-stone-400 hover:text-stone-600 transition-colors text-lg leading-none"
              aria-label="Close report"
            >
              ×
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5">
            {isLoadingReport && (
              <p className="text-sm text-stone-400">Loading…</p>
            )}

            {!isLoadingReport && report && (
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-widest text-stone-400 mb-3">
                    Negative emotions detected
                  </p>
                  {report.negativeEmotions.length === 0 ? (
                    <p className="text-sm text-stone-500 leading-relaxed">
                      No negative emotions detected — sounds like a good day.
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {report.negativeEmotions.map((emotion) => (
                        <li
                          key={emotion}
                          className="flex items-center gap-2 text-sm text-stone-700 leading-relaxed"
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: "#4a6741" }}
                          />
                          {emotion}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {!isLoadingReport && !report && (
              <p className="text-sm text-stone-400">Could not load report.</p>
            )}
          </div>
        </div>
        </>
      )}
    </div>
  );
}
