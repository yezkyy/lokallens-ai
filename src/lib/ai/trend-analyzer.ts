import { PROMPTS } from "./prompts";

export async function analyzeMarketTrends(focusArea: string = "Samarinda UMKM") {
  const apiKey = process.env.KOBOLLM_API_KEY || process.env.GEMINI_API_KEY;
  const baseUrl = process.env.KOBOLLM_BASE_URL; 
  // Update to a more likely recognized name, but emphasize environment configuration
  const modelName = process.env.KOBOLLM_MODEL || "gemini-2.0-flash"; 

  const prompt = PROMPTS.TREND_ANALYZER.replace("{focusArea}", focusArea);

  try {
    let text = "";

    if (baseUrl) {
      const targetUrl = `${baseUrl}/chat/completions`;
      console.log(`[AI] Calling KoboLLM: ${targetUrl} with model: ${modelName}`);
      
      const response = await fetch(targetUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: modelName,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[AI] KoboLLM API Failure (${response.status}):`, errorText);
        
        let detailedMsg = errorText;
        try {
          const parsed = JSON.parse(errorText);
          detailedMsg = parsed.error?.message || errorText;
        } catch (e) {}

        throw new Error(`KoboLLM Error (${response.status}): ${detailedMsg}. \n\nTips: Cek apakah nama model "${modelName}" sudah benar di .env.local (KOBOLLM_MODEL).`);
      }

      const data = await response.json();
      text = data.choices?.[0]?.message?.content || "";
    } else {
      // Fallback to standard Gemini SDK
      const { koboAI } = await import("./gemini");
      const model = koboAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      text = result.response.text();
    }

    if (!text) throw new Error("AI returned an empty response");

    // Robust JSON extraction - find the first '{' and last '}'
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');

    if (firstBrace === -1 || lastBrace === -1) {
       throw new Error("AI output did not contain a valid JSON object");
    }

    const jsonString = text.substring(firstBrace, lastBrace + 1);

    try {
      return JSON.parse(jsonString);
    } catch (e) {
      console.error("[AI] JSON Parse Error. Raw text from AI:", text);
      throw new Error("AI returned malformed data. Please try again.");
    }

  } catch (error: any) {
    console.error("[AI] analyzeMarketTrends CRITICAL FAILURE:", error);
    throw error;
  }
}
