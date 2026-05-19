"use client";

import { useState } from "react";

type Props = {
  sidebar: React.ReactNode;
  children: React.ReactNode;
};

export default function ChatLayoutShell({ sidebar, children }: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-stone-100">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed md:relative inset-y-0 left-0 z-50 md:z-auto shrink-0 bg-white border-r border-stone-200 flex flex-col transition-transform md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        style={{ width: 260 }}
      >
        {sidebar}
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-stone-200 shrink-0">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-stone-600 hover:text-stone-900 transition-colors"
            aria-label="Open menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="text-sm font-medium text-stone-900">
            About Your{" "}
            <span style={{ color: "#4a6741" }} className="font-bold">
              Day
            </span>
          </h1>
        </div>

        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
