import { getModel } from "./gemini";
import { PROMPTS } from "./prompts";

export interface CaptionInput {
  productName: string;
  category: string;
  sellingStyle: string;
  targetAudience: string;
  tone: string;
}

export async function generateCaption(input: CaptionInput) {
  try {
    const model = getModel("gemini-2.0-flash");
    
    const prompt = PROMPTS.CAPTION_GENERATOR
      .replace("{productName}", input.productName)
      .replace("{category}", input.category)
      .replace("{sellingStyle}", input.sellingStyle)
      .replace("{targetAudience}", input.targetAudience)
      .replace("{tone}", input.tone);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up JSON response if model adds markdown blocks
    const jsonString = text.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error in generateCaption:", error);
    throw error;
  }
}
