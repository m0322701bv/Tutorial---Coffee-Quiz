import { NextResponse } from "next/server";
import {
  getQuizResults,
  getAnalyticsEvents,
  isFirebaseConfigured,
} from "@/app/lib/firebase";

export async function GET() {
  try {
    if (!isFirebaseConfigured()) {
      return NextResponse.json({
        configured: false,
        message: "Firebase not configured. Stats will appear once Firebase is set up.",
        stats: {
          totalResults: 0,
          completionRate: 0,
          personalityDistribution: {},
          recentResults: [],
        },
      });
    }

    const [results, events] = await Promise.all([
      getQuizResults(1000),
      getAnalyticsEvents(1000),
    ]);

    // Calculate stats
    const startedEvents = events.filter((e) => e.event === "quiz_started");
    const completedEvents = events.filter((e) => e.event === "quiz_completed");
    const completionRate =
      startedEvents.length > 0
        ? Math.round((completedEvents.length / startedEvents.length) * 100)
        : 0;

    // Personality distribution
    const personalityDistribution: Record<string, number> = {};
    results.forEach((result) => {
      const personality = result.personality;
      personalityDistribution[personality] =
        (personalityDistribution[personality] || 0) + 1;
    });

    // Answer frequency per question
    const answerFrequency: Record<number, Record<string, number>> = {};
    events
      .filter((e) => e.event === "question_answered")
      .forEach((e) => {
        const data = e.data as { questionIndex?: number; personality?: string };
        if (data.questionIndex !== undefined && data.personality) {
          if (!answerFrequency[data.questionIndex]) {
            answerFrequency[data.questionIndex] = {};
          }
          answerFrequency[data.questionIndex][data.personality] =
            (answerFrequency[data.questionIndex][data.personality] || 0) + 1;
        }
      });

    // Average quiz duration
    const durations = completedEvents
      .map((e) => (e.data as { duration?: number }).duration)
      .filter((d): d is number => typeof d === "number");
    const avgDuration =
      durations.length > 0
        ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length / 1000)
        : 0;

    return NextResponse.json({
      configured: true,
      stats: {
        totalResults: results.length,
        totalStarted: startedEvents.length,
        totalCompleted: completedEvents.length,
        completionRate,
        personalityDistribution,
        answerFrequency,
        avgDurationSeconds: avgDuration,
        recentResults: results.slice(0, 10),
      },
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
