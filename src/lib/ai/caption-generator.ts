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
    const apiKey = process.env.KOBOLLM_API_KEY || process.env.GEMINI_API_KEY;
    const baseUrl = "https://lite.koboillm.com/v1";
    
    // Menggunakan gpt-4o-mini untuk jaminan kompatibilitas rute KoboILLM
    const modelName = "gpt-4o-mini";

    const prompt = PROMPTS.CAPTION_GENERATOR
      .replace("{productName}", input.productName)
      .replace("{category}", input.category)
      .replace("{sellingStyle}", input.sellingStyle)
      .replace("{targetAudience}", input.targetAudience)
      .replace("{tone}", input.tone);

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: modelName,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" } // Memaksa output JSON
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.detail || result.error?.message || "Gagal generate caption");
    }

    const text = result.choices[0].message.content;
    const jsonString = text.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(jsonString);
  } catch (error: any) {
    console.error("Error in generateCaption:", error);
    throw error;
  }
}
