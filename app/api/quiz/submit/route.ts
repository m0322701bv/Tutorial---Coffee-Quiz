import { NextRequest, NextResponse } from "next/server";
import { saveQuizResult, isFirebaseConfigured } from "@/app/lib/firebase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { memberId, personality, scores, answers, duration } = body;

    if (!personality || !scores) {
      return NextResponse.json(
        { error: "Missing required fields: personality and scores" },
        { status: 400 }
      );
    }

    // If Firebase isn't configured, just acknowledge receipt
    if (!isFirebaseConfigured()) {
      console.log("[Quiz Submit] Firebase not configured, result logged:", {
        personality,
        scores,
      });
      return NextResponse.json({
        success: true,
        message: "Result logged (Firebase not configured)",
      });
    }

    const docId = await saveQuizResult({
      memberId,
      personality,
      scores,
      answers: answers || [],
      duration,
    });

    return NextResponse.json({
      success: true,
      id: docId,
    });
  } catch (error) {
    console.error("Error saving quiz result:", error);
    return NextResponse.json(
      { error: "Failed to save quiz result" },
      { status: 500 }
    );
  }
}
