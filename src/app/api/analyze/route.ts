import { NextResponse } from "next/server";
import { analyzeLocation } from "@/lib/analysis";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { location?: string };
  const requestedLocation = body.location ?? "Can Tho, Vietnam";

  try {
    const analysis = await analyzeLocation(requestedLocation);
    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Analyze route failed:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Analysis failed."
      },
      { status: 500 }
    );
  }
}
