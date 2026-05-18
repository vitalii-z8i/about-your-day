"use client";

import { useRef, useEffect } from "react";

type Props = {
  onSend: (message: string) => void;
  disabled: boolean;
};

export default function MessageInput({ onSend, disabled }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!disabled) ref.current?.focus();
  }, [disabled]);

  function resize() {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  function submit() {
    const value = ref.current?.value.trim();
    if (!value || disabled) return;
    onSend(value);
    if (ref.current) {
      ref.current.value = "";
      ref.current.style.height = "auto";
    }
  }

  return (
    <div className="flex items-center gap-3 bg-white border border-stone-200 rounded-xl px-4 py-3">
      <textarea
        ref={ref}
        rows={1}
        disabled={disabled}
        onInput={resize}
        onKeyDown={handleKeyDown}
        placeholder="Write something…"
        className="flex-1 resize-none text-sm text-stone-900 placeholder:text-stone-400 outline-none bg-transparent leading-relaxed disabled:opacity-50"
      />
      <button
        onClick={submit}
        disabled={disabled}
        aria-label="Send"
        className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-white transition-opacity disabled:opacity-40"
        style={{ backgroundColor: "#4a6741" }}
      >
        {/* Heroicons ArrowUpIcon (solid 20×20) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4"
        >
          <path
            fillRule="evenodd"
            d="M10 17a.75.75 0 0 1-.75-.75V5.612L5.29 9.77a.75.75 0 0 1-1.08-1.04l5.25-5.5a.75.75 0 0 1 1.08 0l5.25 5.5a.75.75 0 1 1-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0 1 10 17Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}
