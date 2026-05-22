import { NextRequest, NextResponse } from "next/server";
import { analyzeMarketTrends } from "@/lib/ai/trend-analyzer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { focusArea } = body;

    const result = await analyzeMarketTrends(focusArea || "Samarinda UMKM");

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("API Error (analyze-market-trends):", error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze market trends" },
      { status: 500 }
    );
  }
}
