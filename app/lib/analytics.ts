import { isFirebaseConfigured } from "./firebase";

// Analytics event types
export type AnalyticsEventType =
  | "quiz_started"
  | "question_answered"
  | "quiz_completed";

interface QuizStartedData {
  timestamp: number;
}

interface QuestionAnsweredData {
  questionIndex: number;
  answerId: string;
  personality: string;
  timestamp: number;
}

interface QuizCompletedData {
  primaryPersonality: string;
  allScores: Record<string, number>;
  duration: number;
  timestamp: number;
}

type AnalyticsData = QuizStartedData | QuestionAnsweredData | QuizCompletedData;

// Track analytics events via API
export async function trackEvent(
  event: AnalyticsEventType,
  data: AnalyticsData
): Promise<void> {
  // Only track if Firebase is configured
  if (!isFirebaseConfigured()) {
    console.log(`[Analytics] ${event}:`, data);
    return;
  }

  try {
    await fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, data }),
    });
  } catch (error) {
    console.error("Failed to track analytics event:", error);
  }
}

// Helper functions for common events
export function trackQuizStarted(): void {
  trackEvent("quiz_started", { timestamp: Date.now() });
}

export function trackQuestionAnswered(
  questionIndex: number,
  answerId: string,
  personality: string
): void {
  trackEvent("question_answered", {
    questionIndex,
    answerId,
    personality,
    timestamp: Date.now(),
  });
}

export function trackQuizCompleted(
  primaryPersonality: string,
  allScores: Record<string, number>,
  duration: number
): void {
  trackEvent("quiz_completed", {
    primaryPersonality,
    allScores,
    duration,
    timestamp: Date.now(),
  });
}
