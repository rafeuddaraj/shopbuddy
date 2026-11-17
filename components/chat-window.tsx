"use client";

import { useEffect, useRef, useState } from "react";
import type { ChatStatus, UIMessage } from "ai";
import { MessageContent } from "@/components/message-content";

type ChatWindowProps = {
  messages: UIMessage[];
  status: ChatStatus;
  onSend: (text: string) => void;
  onApprovalResponse?: (approvalId: string, approved: boolean) => void;
};

export function ChatWindow({
  messages,
  status,
  onSend,
  onApprovalResponse,
}: ChatWindowProps) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    onSend(text);
    setInput("");
  }

  return (
    <div className="mx-auto flex h-dvh w-full max-w-2xl flex-col px-4">
      <header className="flex items-center gap-3 border-b border-zinc-200 py-4 dark:border-zinc-800">
        <div className="flex size-10 items-center justify-center rounded-full bg-emerald-600 text-lg font-semibold text-white">
          S
        </div>
        <div>
          <h1 className="text-lg font-semibold">ShopBuddy</h1>
          <p className="text-sm text-zinc-500">Gadget Hub Support</p>
        </div>
      </header>

      <main className="flex-1 space-y-4 overflow-y-auto py-6">
        {messages.length === 0 && (
          <p className="mt-16 text-center text-zinc-500">
            Ask me about your orders, products, or returns.
          </p>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={
              message.role === "user" ? "flex justify-end" : "flex justify-start"
            }
          >
            <div
              className={
                message.role === "user"
                  ? "max-w-[80%] rounded-2xl rounded-br-sm bg-emerald-600 px-4 py-2 text-white"
                  : "max-w-[80%] space-y-2 rounded-2xl rounded-bl-sm bg-zinc-100 px-4 py-2 dark:bg-zinc-800"
              }
            >
              <MessageContent
                message={message}
                onApprovalResponse={onApprovalResponse}
              />
            </div>
          </div>
        ))}

        {status === "submitted" && (
          <p className="text-sm text-zinc-500">ShopBuddy is thinking…</p>
        )}
        <div ref={bottomRef} />
      </main>

      <form
        onSubmit={handleSubmit}
        className="flex gap-2 border-t border-zinc-200 py-4 dark:border-zinc-800"
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Type your message…"
          className="flex-1 rounded-full border border-zinc-300 bg-transparent px-4 py-2 outline-none focus:border-emerald-600 dark:border-zinc-700"
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-emerald-600 px-5 py-2 font-medium text-white disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
