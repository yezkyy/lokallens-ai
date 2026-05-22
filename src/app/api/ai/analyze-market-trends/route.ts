import { NextRequest, NextResponse } from "next/server";
import { analyzeMarketTrends } from "@/lib/ai/trend-analyzer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { focusArea } = body;
    console.log("Analyzing trends for:", focusArea);

    const result = await analyzeMarketTrends(focusArea || "Samarinda UMKM");

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("CRITICAL API Error (analyze-market-trends):", error);
    
    // Extract meaningful error message
    const errorMessage = error.message || "Failed to analyze market trends";
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error.stack,
        hint: "Periksa KOBOLLM_BASE_URL dan API_KEY di .env.local"
      },
      { status: 500 }
    );
  }
}
