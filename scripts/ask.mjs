import { generateText } from "ai";
import { google } from "@ai-sdk/google";

const result = await generateText({
  model: google("gemini-3.5-flash-lite"),
  prompt: "I'm new to gadgets. Write a detailed guide to USB-C, Lightning and micro-USB, with examples of devices that use each.",
});

console.log(result.text);
console.log(result.usage);
