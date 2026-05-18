"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ConversationListItem } from "@/src/application/use-cases/conversation/conversation.types";
import LogoutButton from "./logout-button";

function relativeTime(date: Date): string {
  const now = Date.now();
  const diff = now - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

type Props = {
  conversations: ConversationListItem[];
};

export default function Sidebar({ conversations }: Props) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-4 pt-5 pb-3 border-b border-stone-100 flex flex-col gap-3">
        <h1 className="text-sm font-medium tracking-tight text-stone-900 text-center">
          About your day
        </h1>
        <Link
          href="/chats"
          className="flex items-center justify-center w-full py-2 px-3 text-sm font-medium text-white rounded-lg transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#4a6741" }}
        >
          New chat
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        {conversations.length === 0 ? (
          <p className="px-4 py-3 text-xs text-stone-400">No previous chats</p>
        ) : (
          conversations.map((conv) => {
            const isActive = pathname === `/chats/${conv.id}`;
            return (
              <Link
                key={conv.id}
                href={`/chats/${conv.id}`}
                className={`flex flex-col px-4 py-3 hover:bg-stone-50 transition-colors border-l-2 ${
                  isActive
                    ? "bg-stone-50 border-l-[#4a6741]"
                    : "border-l-transparent"
                }`}
              >
                <span className="text-sm text-stone-900 truncate leading-snug">
                  {conv.summary ?? "New conversation"}
                </span>
                <span className="text-xs text-stone-400 mt-0.5">
                  {relativeTime(conv.startedAt)}
                </span>
              </Link>
            );
          })
        )}
      </nav>

      <div className="px-4 py-4 border-t border-stone-100">
        <LogoutButton />
      </div>
    </div>
  );
}
