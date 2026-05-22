import { PROMPTS } from "./prompts";

export interface PricingInput {
  modalPrice: number;
  targetMargin: number;
  competitorPricing: string;
}

export async function generatePricingStrategy(input: PricingInput) {
  try {
    const apiKey = process.env.KOBOLLM_API_KEY || process.env.GEMINI_API_KEY;
    const baseUrl = "https://lite.koboillm.com/v1";
    
    // Menggunakan gpt-4o-mini untuk jaminan kompatibilitas rute KoboILLM
    const modelName = "gpt-4o-mini";

    const prompt = PROMPTS.PRICING_STRATEGY
      .replace("{modalPrice}", input.modalPrice.toString())
      .replace("{targetMargin}", input.targetMargin.toString())
      .replace("{competitorPricing}", input.competitorPricing);

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: modelName,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.detail || result.error?.message || "Gagal generate pricing");
    }

    const text = result.choices[0].message.content;
    const jsonString = text.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(jsonString);
  } catch (error: any) {
    console.error("Error in generatePricingStrategy:", error);
    throw error;
  }
}
