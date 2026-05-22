import { NextRequest, NextResponse } from "next/server";
import { generateCaption } from "@/lib/ai/caption-generator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productName, category, sellingStyle, targetAudience, tone } = body;

    if (!productName || !category) {
      return NextResponse.json(
        { error: "Product name and category are required" },
        { status: 400 }
      );
    }

    const result = await generateCaption({
      productName,
      category,
      sellingStyle: sellingStyle || "General",
      targetAudience: targetAudience || "All",
      tone: tone || "Professional",
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("API Error (generate-caption):", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate caption" },
      { status: 500 }
    );
  }
}
