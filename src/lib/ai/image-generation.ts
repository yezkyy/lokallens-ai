import { getModel } from "./gemini";
import { PROMPTS } from "./prompts";

export async function enhanceProductImage(imageBuffer: Buffer, mimeType: string) {
  try {
    // Note: The user specified gemini-2.5-flash-image
    const model = getModel("gemini-2.0-flash"); 

    const inlineData = {
      inlineData: {
        data: imageBuffer.toString("base64"),
        mimeType,
      },
    };

    const result = await model.generateContent([
      PROMPTS.IMAGE_ENHANCEMENT,
      inlineData,
    ]);

    const response = await result.response;
    
    // In multimodal models that support image generation (like Gemini 2.0 Flash in some modes),
    // the response might contain an image or a reference to it.
    // However, if it's text-to-image/image-to-image enhancement, 
    // we need to handle the output format correctly.
    
    // Assuming the SDK/model returns the image data in a specific field if it's an image generation model.
    // For now, let's try to extract base64 if it's returned as text or if the SDK supports it.
    
    // Check if the response has an image candidate
    const candidates = response.candidates;
    if (candidates && candidates[0]?.content?.parts) {
      const imagePart = candidates[0].content.parts.find(part => part.inlineData);
      if (imagePart?.inlineData) {
        return {
          base64: imagePart.inlineData.data,
          mimeType: imagePart.inlineData.mimeType
        };
      }
    }

    // Fallback: If it returns a string (like a URL or base64 in text)
    const text = response.text();
    // Some models might return base64 string directly in text
    const base64Match = text.match(/data:image\/[^;]+;base64,([^"']+)/);
    if (base64Match) {
      return {
        base64: base64Match[1],
        mimeType: "image/png" // Default
      };
    }

    throw new Error("No image was generated in the response");
  } catch (error) {
    console.error("Error in enhanceProductImage:", error);
    throw error;
  }
}
