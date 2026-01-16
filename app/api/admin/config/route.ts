import { NextRequest, NextResponse } from "next/server";
import {
  getQuizConfig,
  setQuizConfig,
  isFirebaseConfigured,
} from "@/app/lib/firebase";
import { questions, personalities, personalityOrder } from "@/app/quiz-data";

export async function GET() {
  try {
    if (!isFirebaseConfigured()) {
      return NextResponse.json({
        configured: false,
        questions,
        personalities,
        personalityOrder,
        source: "static",
      });
    }

    const [questionsConfig, personalitiesConfig] = await Promise.all([
      getQuizConfig("questions"),
      getQuizConfig("personalities"),
    ]);

    return NextResponse.json({
      configured: true,
      questions:
        (questionsConfig as { questions?: typeof questions })?.questions || questions,
      personalities:
        (personalitiesConfig as { personalities?: typeof personalities })?.personalities ||
        personalities,
      personalityOrder:
        (personalitiesConfig as { personalityOrder?: typeof personalityOrder })
          ?.personalityOrder || personalityOrder,
      source: questionsConfig || personalitiesConfig ? "firebase" : "static",
    });
  } catch (error) {
    console.error("Error fetching admin config:", error);
    return NextResponse.json(
      { error: "Failed to fetch config" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!isFirebaseConfigured()) {
      return NextResponse.json(
        {
          error: "Firebase not configured. Cannot save config.",
          configured: false,
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { questions: newQuestions, personalities: newPersonalities, personalityOrder: newOrder } =
      body;

    const updates: Promise<void>[] = [];

    if (newQuestions) {
      updates.push(setQuizConfig("questions", { questions: newQuestions }));
    }

    if (newPersonalities || newOrder) {
      updates.push(
        setQuizConfig("personalities", {
          personalities: newPersonalities || personalities,
          personalityOrder: newOrder || personalityOrder,
        })
      );
    }

    await Promise.all(updates);

    return NextResponse.json({
      success: true,
      message: "Config updated successfully",
    });
  } catch (error) {
    console.error("Error updating admin config:", error);
    return NextResponse.json(
      { error: "Failed to update config" },
      { status: 500 }
    );
  }
}
