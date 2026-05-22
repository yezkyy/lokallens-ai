import { NextRequest, NextResponse } from "next/server";
import { enhanceProductImage } from "@/lib/ai/image-generation";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type;

    const result = await enhanceProductImage(buffer, mimeType);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("API Error (enhance-product-image):", error);
    return NextResponse.json(
      { error: error.message || "Failed to enhance image" },
      { status: 500 }
    );
  }
}
