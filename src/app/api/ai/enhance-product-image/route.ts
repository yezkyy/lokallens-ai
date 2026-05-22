import { NextRequest, NextResponse } from "next/server";
import { enhanceProductImage, ImageEnhanceOptions } from "@/lib/ai/image-generation";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;
    const quality = (formData.get("quality") as ImageEnhanceOptions["quality"]) || "standard";
    const aspectRatio = (formData.get("aspectRatio") as ImageEnhanceOptions["aspectRatio"]) || "1:1";
    
    // New parameters
    const visualStyle = formData.get("visualStyle") as string;
    const studioStyle = formData.get("studioStyle") as string;
    const lighting = formData.get("lighting") as string;
    const customInstruction = formData.get("customInstruction") as string;

    if (!file) {
      return NextResponse.json(
        { error: "File gambar tidak ditemukan." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type;

    const result = await enhanceProductImage(buffer, mimeType, {
      quality,
      aspectRatio,
      visualStyle,
      studioStyle,
      lighting,
      customInstruction
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("API Error (enhance-product-image):", error);
    return NextResponse.json(
      { error: error.message || "Gagal memproses gambar." },
      { status: 500 }
    );
  }
}
