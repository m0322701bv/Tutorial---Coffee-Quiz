import { NextRequest, NextResponse } from "next/server";
import { getQuizResults, isFirebaseConfigured } from "@/app/lib/firebase";

export async function GET(request: NextRequest) {
  try {
    if (!isFirebaseConfigured()) {
      return NextResponse.json({
        configured: false,
        results: [],
        total: 0,
        message: "Firebase not configured",
      });
    }

    const searchParams = request.nextUrl.searchParams;
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : 100;

    const results = await getQuizResults(limit);

    return NextResponse.json({
      configured: true,
      results,
      total: results.length,
    });
  } catch (error) {
    console.error("Error fetching admin results:", error);
    return NextResponse.json(
      { error: "Failed to fetch results" },
      { status: 500 }
    );
  }
}
