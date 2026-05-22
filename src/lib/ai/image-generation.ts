export interface ImageEnhanceOptions {
  quality: "standard" | "cinematic";
  aspectRatio: "1:1" | "4:5" | "16:9";
  visualStyle?: string;
  studioStyle?: string;
  lighting?: string;
  customInstruction?: string;
}

// Fungsi rekursif untuk mencari string Base64 gambar di mana pun di dalam JSON
function findImageDeep(obj: any): string | null {
  if (!obj) return null;
  
  // Jika ini adalah string, cek apakah ini Base64 gambar
  if (typeof obj === 'string') {
    if (obj.length > 500 && (obj.includes('iVBOR') || obj.includes('/9j/'))) {
      return obj.replace(/^data:image\/[a-z]+;base64,/, "").replace(/[\s\n\r]/g, "").trim();
    }
  }

  // Jika ini adalah array, telusuri isinya
  if (Array.isArray(obj)) {
    for (const item of obj) {
      const result = findImageDeep(item);
      if (result) return result;
    }
  }

  // Jika ini adalah object, cek kunci-kunci populer atau telusuri rekursif
  if (typeof obj === 'object') {
    if (obj.b64_json) return obj.b64_json;
    if (obj.url && obj.url.startsWith('data:image')) return obj.url.split('base64,')[1];
    if (obj.inline_data?.data || obj.inlineData?.data) return obj.inline_data?.data || obj.inlineData?.data;
    if (obj.data && typeof obj.data === 'string' && obj.data.length > 500) return obj.data;

    for (const key in obj) {
      const result = findImageDeep(obj[key]);
      if (result) return result;
    }
  }

  return null;
}

export async function enhanceProductImage(
  imageBuffer: Buffer, 
  mimeType: string,
  options: ImageEnhanceOptions
) {
  try {
    const apiKey = process.env.KOBOLLM_API_KEY || process.env.GEMINI_API_KEY;
    const baseUrl = "https://api.koboillm.com/v1";
    const modelName = "gemini/gemini-2.5-flash-image";

    const prompt = `PRODUCT VISUAL ENHANCEMENT.
PRODUCT: Keep 100% Identical.
ENVIRONMENT: ${options.studioStyle || 'Luxury Studio'}.
STYLE: ${options.visualStyle || 'Cinematic'}.
LIGHTING: ${options.lighting || 'Professional'}.
INSTRUCTION: ${options.customInstruction || ''}

OUTPUT: Process and return the final image data.`;

    const payload = {
      model: modelName,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: { url: `data:${mimeType};base64,${imageBuffer.toString("base64")}` }
            }
          ]
        }
      ]
    };

    console.log(`[LokalLens] Deep Request Gemini 2.5 Image...`);

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(result));
    }

    // GUNAKAN DEEP SCAN UNTUK MENEMUKAN GAMBAR
    const extractedBase64 = findImageDeep(result);

    if (extractedBase64) {
      console.log("[SUCCESS] Gambar ditemukan lewat Deep Scan!");
      return { base64: extractedBase64, mimeType: "image/png" };
    }

    // Jika gagal, lempar seluruh JSON agar kita bisa lihat isinya di UI
    throw new Error(`GAGAL EKSTRAK. Respon Lengkap: ${JSON.stringify(result)}`);

  } catch (error: any) {
    console.error("Critical Image Service Error:", error);
    throw error;
  }
}
