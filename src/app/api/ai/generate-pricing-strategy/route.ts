import { NextRequest, NextResponse } from "next/server";
import { generatePricingStrategy } from "@/lib/ai/pricing-strategy";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { modalPrice, targetMargin, competitorPricing } = body;

    if (modalPrice === undefined || targetMargin === undefined) {
      return NextResponse.json(
        { error: "Modal price and target margin are required" },
        { status: 400 }
      );
    }

    const result = await generatePricingStrategy({
      modalPrice,
      targetMargin,
      competitorPricing: competitorPricing || "Not specified",
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("API Error (generate-pricing-strategy):", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate pricing strategy" },
      { status: 500 }
    );
  }
}
