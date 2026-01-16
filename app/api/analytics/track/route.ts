import { NextRequest, NextResponse } from "next/server";
import { logAnalyticsEvent, isFirebaseConfigured } from "@/app/lib/firebase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, data } = body;

    if (!event) {
      return NextResponse.json(
        { error: "Missing required field: event" },
        { status: 400 }
      );
    }

    // If Firebase isn't configured, just acknowledge receipt
    if (!isFirebaseConfigured()) {
      console.log("[Analytics] Event tracked (Firebase not configured):", event, data);
      return NextResponse.json({
        success: true,
        message: "Event logged (Firebase not configured)",
      });
    }

    const docId = await logAnalyticsEvent(event, data || {});

    return NextResponse.json({
      success: true,
      id: docId,
    });
  } catch (error) {
    console.error("Error tracking analytics event:", error);
    return NextResponse.json(
      { error: "Failed to track analytics event" },
      { status: 500 }
    );
  }
}
