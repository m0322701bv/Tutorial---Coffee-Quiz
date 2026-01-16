import { NextResponse } from "next/server";
import { getQuizConfig, isFirebaseConfigured } from "@/app/lib/firebase";
import { questions, personalities, personalityOrder } from "@/app/quiz-data";

export async function GET() {
  try {
    // If Firebase isn't configured, return static data
    if (!isFirebaseConfigured()) {
      return NextResponse.json({
        questions,
        personalities,
        personalityOrder,
        source: "static",
      });
    }

    // Try to fetch from Firebase
    const [questionsConfig, personalitiesConfig] = await Promise.all([
      getQuizConfig("questions"),
      getQuizConfig("personalities"),
    ]);

    // If no Firebase config exists, return static data
    if (!questionsConfig && !personalitiesConfig) {
      return NextResponse.json({
        questions,
        personalities,
        personalityOrder,
        source: "static",
      });
    }

    // Merge Firebase config with static defaults
    return NextResponse.json({
      questions: (questionsConfig as { questions?: typeof questions })?.questions || questions,
      personalities:
        (personalitiesConfig as { personalities?: typeof personalities })?.personalities ||
        personalities,
      personalityOrder:
        (personalitiesConfig as { personalityOrder?: typeof personalityOrder })?.personalityOrder ||
        personalityOrder,
      source: "firebase",
    });
  } catch (error) {
    console.error("Error fetching quiz config:", error);
    // Fallback to static data on error
    return NextResponse.json({
      questions,
      personalities,
      personalityOrder,
      source: "static",
      error: "Failed to fetch from Firebase, using static data",
    });
  }
}
