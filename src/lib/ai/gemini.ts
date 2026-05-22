import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY in environment variables");
}

export const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Helper to get a model
export const getModel = (modelName: string = "gemini-2.0-flash") => {
  // If user requested 2.5 specifically, we'll try to use it.
  // Note: Gemini 2.0 Flash is the current high-performance multimodal model.
  return genAI.getGenerativeModel({ model: modelName });
};
