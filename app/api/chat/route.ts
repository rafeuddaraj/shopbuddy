import {
  streamText,
  convertToModelMessages,
  toUIMessageStream,
  createUIMessageStreamResponse,
  tool,
  isStepCount,
  type UIMessage,
} from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { findOrder } from "@/lib/orders";

// In a real app this comes from the logged-in user's session.
const CURRENT_CUSTOMER_ID = "CUST-1";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: google("gemini-3.5-flash-lite"),
    instructions:
      "You are ShopBuddy, the friendly support assistant for Gadget Hub, a small online gadget shop. Keep your answers short and helpful. Always start your first reply with 'Hey there! 👋'.",
    messages: await convertToModelMessages(messages),
    stopWhen: isStepCount(5),
    tools: {
      getOrderStatus: tool({
        description: "Get the status of a Gadget Hub order by its order ID.",
        inputSchema: z.object({
          orderId: z.string().describe("The order ID, for example ORD-1042"),
        }),
        execute: async ({ orderId }) => {
          const order = findOrder(orderId);
          if (!order || order.customerId !== CURRENT_CUSTOMER_ID) {
            return { error: "Order not found." };
          }
          return { item: order.item, status: order.status, eta: order.eta };
        },
      }),
      refundOrder: tool({
        description: "Refund a Gadget Hub order. Use it only when the customer asks for a refund.",
        inputSchema: z.object({
          orderId: z.string().describe("The order ID to refund"),
        }),
        execute: async ({ orderId }) => {
          const order = findOrder(orderId);
          if (!order || order.customerId !== CURRENT_CUSTOMER_ID) {
            return { error: "Order not found." };
          }
          return { refunded: true, orderId: order.id, amount: order.price };
        },
      }),
    },
    toolApproval: {
      refundOrder: "user-approval",
    },
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
