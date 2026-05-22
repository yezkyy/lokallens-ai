import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY in environment variables");
}

// Standard Gemini Client
export const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// KoboILLM Optimized Client
export const koboAI = new GoogleGenAI({
  apiKey: process.env.KOBOLLM_API_KEY || process.env.GEMINI_API_KEY,
  httpOptions: {
    baseUrl: process.env.KOBOLLM_BASE_URL || "https://api.koboillm.com/v1",
  },
});
