import { genAI } from "./gemini";
import { PROMPTS } from "./prompts";

export async function generateMarketingStrategy(productName: string, category: string) {
  try {
    const prompt = `You are an expert marketing strategist for Indonesian UMKM.
Analyze the product: "${productName}" in category: "${category}".

Provide a comprehensive and actionable marketing strategy including:
1. Best posting time (specifically for Samarinda/WITA time, e.g., 19:30).
2. The reasoning behind that specific time (briefly).
3. Effective platforms (Instagram, TikTok, WhatsApp, etc.).
4. Visual strategy: Detailed advice on photography, lighting, and layout to make the product stand out.
5. Content hooks: 3 catchy opening lines or themes for the post.
6. Trending hashtags: A mix of general and local Samarinda/Kaltim hashtags.

Return ONLY a JSON object:
{
  "bestTime": "HH:mm",
  "timeReasoning": "Why this time is best...",
  "platforms": ["Platform 1", "Platform 2"],
  "strategy": "Detailed visual and presentation strategy...",
  "contentHooks": ["Hook 1", "Hook 2", "Hook 3"],
  "hashtags": ["#tag1", "#tag2"]
}`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonString = text.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(jsonString);
  } catch (error: any) {
    console.error("Error in generateMarketingStrategy:", error);
    // Fallback strategy if AI fails
    return {
      bestTime: "12:00",
      timeReasoning: "Waktu istirahat makan siang biasanya memiliki trafik tinggi di Samarinda.",
      platforms: ["Instagram", "WhatsApp"],
      strategy: "Gunakan pencahayaan alami (golden hour) dan pastikan produk menjadi fokus utama. Gunakan latar belakang yang kontras namun tetap bersih.",
      contentHooks: [
        "Lagi cari kado unik? Cek yang satu ini!",
        "Kualitas premium, harga UMKM. Hanya hari ini!",
        "Rahasia UMKM sukses di Samarinda terungkap!"
      ],
      hashtags: ["#UMKMIndonesia", "#ProdukLokal", "#LokalLensAI", "#SamarindaUpdate", "#Kaltim"]
    };
  }
}
