import { NextRequest, NextResponse } from "next/server";
import { analyzeVoiceIntent } from "@/lib/ai/voice-intent";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { transcript } = body;

    if (!transcript) {
      return NextResponse.json(
        { error: "Transcript is required" },
        { status: 400 }
      );
    }

    const result = await analyzeVoiceIntent(transcript);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("API Error (voice-intent):", error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze voice intent" },
      { status: 500 }
    );
  }
}
