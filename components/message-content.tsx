import type { UIMessage } from "ai";

type MessageContentProps = {
  message: UIMessage;
  onApprovalResponse?: (approvalId: string, approved: boolean) => void;
};

// The parts of each message are shown here.
export function MessageContent({ message, onApprovalResponse }: MessageContentProps) {
  return message.parts.map((part, index) => {
    if (part.type === "text") {
      return <p key={index}>{part.text}</p>;
    }
    if (part.type === "tool-getOrderStatus") {
      if (part.state !== "output-available") {
        return <p key={index} className="tool-note">Looking up order…</p>;
      }
      const output = part.output as { error?: string };
      return (
        <p key={index} className="tool-note">
          {output.error ? "Order not found ✗" : "Order found ✓"}
        </p>
      );
    }
    if (part.type === "tool-refundOrder") {
      if (part.state === "approval-requested") {
        return (
          <div key={index} className="tool-note space-y-2">
            <p>ShopBuddy wants to refund this order. Approve?</p>
            <button
              onClick={() => onApprovalResponse?.(part.approval.id, true)}
              className="rounded-full bg-emerald-600 px-4 py-1 text-white not-italic"
            >
              Approve
            </button>{" "}
            <button
              onClick={() => onApprovalResponse?.(part.approval.id, false)}
              className="rounded-full bg-zinc-600 px-4 py-1 text-white not-italic"
            >
              Deny
            </button>
          </div>
        );
      }
      if (part.state === "output-denied") {
        return <p key={index} className="tool-note">Refund denied ✗</p>;
      }
      if (part.state === "output-available") {
        return <p key={index} className="tool-note">Refund done ✓</p>;
      }
    }
    return null;
  });
}
