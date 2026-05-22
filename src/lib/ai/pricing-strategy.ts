import { getModel } from "./gemini";
import { PROMPTS } from "./prompts";

export interface PricingInput {
  modalPrice: number;
  targetMargin: number;
  competitorPricing: string;
}

export async function generatePricingStrategy(input: PricingInput) {
  try {
    const model = getModel("gemini-2.0-flash");
    
    const prompt = PROMPTS.PRICING_STRATEGY
      .replace("{modalPrice}", input.modalPrice.toString())
      .replace("{targetMargin}", input.targetMargin.toString())
      .replace("{competitorPricing}", input.competitorPricing);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonString = text.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error in generatePricingStrategy:", error);
    throw error;
  }
}
