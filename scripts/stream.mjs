import { streamText } from "ai";
import { google } from "@ai-sdk/google";

const result = streamText({
  model: google("gemini-3.5-flash-lite"),
  prompt: "I'm new to gadgets. Write a detailed guide to USB-C, Lightning and micro-USB, with examples of devices that use each.",
});

for await (const chunk of result.textStream) {
  process.stdout.write(chunk);
}
