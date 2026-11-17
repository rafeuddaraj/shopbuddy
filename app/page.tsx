"use client";

import { useChat } from "@ai-sdk/react";
import { lastAssistantMessageIsCompleteWithApprovalResponses } from "ai";
import { ChatWindow } from "@/components/chat-window";

export default function Home() {
  const { messages, sendMessage, status, addToolApprovalResponse } = useChat({
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,
  });

  return (
    <ChatWindow
      messages={messages}
      status={status}
      onSend={(text) => sendMessage({ text })}
      onApprovalResponse={(id, approved) =>
        addToolApprovalResponse({ id, approved })
      }
    />
  );
}
