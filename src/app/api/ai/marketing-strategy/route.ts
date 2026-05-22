import { NextRequest, NextResponse } from "next/server";
import { generateMarketingStrategy } from "@/lib/ai/marketing-strategy";

export async function POST(req: NextRequest) {
  try {
    const { productName, category } = await req.json();
    
    if (!productName) {
      return NextResponse.json({ error: "Product name is required" }, { status: 400 });
    }

    const strategy = await generateMarketingStrategy(productName, category || "Umum");
    return NextResponse.json(strategy);
  } catch (error: any) {
    console.error("API Error (marketing-strategy):", error);
    return NextResponse.json({ error: "Failed to generate strategy" }, { status: 500 });
  }
}
