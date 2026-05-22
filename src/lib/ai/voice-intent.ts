import { getModel } from "./gemini";
import { PROMPTS } from "./prompts";

export async function analyzeVoiceIntent(transcript: string) {
  try {
    const model = getModel("gemini-2.0-flash");
    
    const prompt = PROMPTS.VOICE_INTENT.replace("{transcript}", transcript);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonString = text.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error in analyzeVoiceIntent:", error);
    throw error;
  }
}
