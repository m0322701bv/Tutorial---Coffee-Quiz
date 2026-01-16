import { NextRequest, NextResponse } from "next/server";
import { saveQuizResult, isFirebaseConfigured, logAnalyticsEvent } from "@/app/lib/firebase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { memberId, personality, scores, answers, duration } = body;

    console.log("[Quiz Submit] Received:", { personality, scores, duration });

    if (!personality || !scores) {
      console.log("[Quiz Submit] Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields: personality and scores" },
        { status: 400 }
      );
    }

    // If Firebase isn't configured, just acknowledge receipt
    if (!isFirebaseConfigured()) {
      console.log("[Quiz Submit] Firebase not configured");
      return NextResponse.json({
        success: true,
        message: "Result logged (Firebase not configured)",
      });
    }

    console.log("[Quiz Submit] Saving to Firebase...");

    // Save to quiz_results collection
    const docId = await saveQuizResult({
      memberId,
      personality,
      scores,
      answers: answers || [],
      duration,
    });

    console.log("[Quiz Submit] Saved with ID:", docId);

    return NextResponse.json({
      success: true,
      id: docId,
    });
  } catch (error) {
    console.error("[Quiz Submit] Error:", error);
    return NextResponse.json(
      { error: "Failed to save quiz result", details: String(error) },
      { status: 500 }
    );
  }
}
