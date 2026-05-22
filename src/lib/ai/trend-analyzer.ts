import { getModel } from "./gemini";
import { PROMPTS } from "./prompts";

export async function analyzeMarketTrends(focusArea: string = "Samarinda UMKM") {
  try {
    const model = getModel("gemini-2.0-flash");
    
    const prompt = PROMPTS.TREND_ANALYZER.replace("{focusArea}", focusArea);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonString = text.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error in analyzeMarketTrends:", error);
    throw error;
  }
}
