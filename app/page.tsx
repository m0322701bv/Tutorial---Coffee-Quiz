"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  questions as staticQuestions,
  personalities as staticPersonalities,
  personalityOrder as staticPersonalityOrder,
  PersonalityType,
  QuizQuestion,
  PersonalityResult,
} from "./quiz-data";
import {
  trackQuizStarted,
  trackQuestionAnswered,
  trackQuizCompleted,
} from "./lib/analytics";

type QuizState = "welcome" | "quiz" | "results";

interface Scores {
  boldAdventurer: number;
  sweetEnthusiast: number;
  zenMinimalist: number;
  healthNut: number;
  indulgentTreat: number;
}

interface AnswerRecord {
  questionIndex: number;
  answerId: string;
  personality: string;
}

export default function Home() {
  const [quizState, setQuizState] = useState<QuizState>("welcome");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<Scores>({
    boldAdventurer: 0,
    sweetEnthusiast: 0,
    zenMinimalist: 0,
    healthNut: 0,
    indulgentTreat: 0,
  });
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const startTimeRef = useRef<number>(0);

  // Config from Firebase (or static fallback)
  const [questions, setQuestions] = useState<QuizQuestion[]>(staticQuestions);
  const [personalities, setPersonalities] = useState<
    Record<PersonalityType, PersonalityResult>
  >(staticPersonalities);
  const [personalityOrder, setPersonalityOrder] = useState<PersonalityType[]>(
    staticPersonalityOrder
  );

  // Fetch config on mount
  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch("/api/quiz/config");
        if (res.ok) {
          const data = await res.json();
          if (data.questions) setQuestions(data.questions);
          if (data.personalities) setPersonalities(data.personalities);
          if (data.personalityOrder) setPersonalityOrder(data.personalityOrder);
        }
      } catch (error) {
        console.log("Using static quiz config", error);
      }
    }
    fetchConfig();
  }, []);

  const handleStart = () => {
    setQuizState("quiz");
    setCurrentQuestion(0);
    setScores({
      boldAdventurer: 0,
      sweetEnthusiast: 0,
      zenMinimalist: 0,
      healthNut: 0,
      indulgentTreat: 0,
    });
    setAnswers([]);
    startTimeRef.current = Date.now();
    trackQuizStarted();
  };

  const handleAnswer = (personality: PersonalityType, answerIndex: number) => {
    const newScores = {
      ...scores,
      [personality]: scores[personality] + 1,
    };
    setScores(newScores);

    // Track answer
    const answerRecord: AnswerRecord = {
      questionIndex: currentQuestion,
      answerId: `q${currentQuestion}_a${answerIndex}`,
      personality,
    };
    setAnswers((prev) => [...prev, answerRecord]);
    trackQuestionAnswered(currentQuestion, answerRecord.answerId, personality);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz completed
      const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
      const primaryPersonality = Object.entries(newScores).sort(
        ([, a], [, b]) => b - a
      )[0][0];

      trackQuizCompleted(primaryPersonality, newScores, duration);

      // Submit result to backend
      submitResult(primaryPersonality, newScores, [...answers, answerRecord], duration);

      setQuizState("results");
    }
  };

  const submitResult = async (
    personality: string,
    scores: Scores,
    answers: AnswerRecord[],
    duration: number
  ) => {
    try {
      console.log("Submitting quiz result:", { personality, scores, duration });
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personality,
          scores,
          answers,
          duration,
        }),
      });
      const data = await res.json();
      console.log("Quiz submit response:", res.status, data);
    } catch (error) {
      console.error("Failed to submit quiz result:", error);
    }
  };

  const handleRetake = () => {
    handleStart();
  };

  const getResults = () => {
    const totalPoints = Object.values(scores).reduce((a, b) => a + b, 0);
    return personalityOrder
      .map((id) => ({
        ...personalities[id],
        score: scores[id],
        percentage: totalPoints > 0 ? Math.round((scores[id] / totalPoints) * 100) : 0,
      }))
      .sort((a, b) => b.score - a.score);
  };

  if (quizState === "welcome") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-lg w-full text-center">
          <div className="mb-8">
            <span className="text-6xl">☕</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold text-[#3d2c1e] mb-4">
            Discover Your Coffee Personality
          </h1>
          <p className="text-lg text-[#5a4a3a] mb-8 leading-relaxed">
            Answer 6 quick questions and find out what your coffee choices say
            about you. Plus, get a personalized drink recommendation from your
            local Basecamp.
          </p>
          <button
            onClick={handleStart}
            className="bg-[#8b6f47] hover:bg-[#6b5635] text-white font-medium py-4 px-8 rounded-full text-lg transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Start the Quiz
          </button>
          <p className="mt-6 text-sm text-[#8b7355]">
            Takes less than 2 minutes
          </p>
        </div>
      </div>
    );
  }

  if (quizState === "quiz") {
    const question = questions[currentQuestion];
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-8">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentQuestion
                    ? "bg-[#8b6f47] scale-125"
                    : index < currentQuestion
                    ? "bg-[#c9a66b]"
                    : "bg-[#e8dcc8]"
                }`}
              />
            ))}
          </div>

          {/* Question number */}
          <p className="text-center text-[#8b7355] mb-4 text-sm font-medium">
            Question {currentQuestion + 1} of {questions.length}
          </p>

          {/* Question */}
          <h2 className="text-2xl md:text-3xl font-semibold text-[#3d2c1e] text-center mb-8">
            {question.question}
          </h2>

          {/* Answer options */}
          <div className="space-y-3">
            {question.answers.map((answer, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(answer.personality, index)}
                className="w-full bg-white hover:bg-[#f5e6d3] border-2 border-[#e8dcc8] hover:border-[#c9a66b] rounded-xl p-4 text-left transition-all duration-200 flex items-center gap-4 group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                  {answer.icon}
                </span>
                <span className="text-[#3d2c1e] font-medium text-lg">
                  {answer.text}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Results state
  const results = getResults();
  const primaryResult = results[0];

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-[#8b7355] mb-2 font-medium">Your result is in!</p>
          <h1 className="text-3xl md:text-4xl font-semibold text-[#3d2c1e]">
            You&apos;re a {primaryResult.name}
          </h1>
        </div>

        {/* Primary result card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 border border-[#e8dcc8]">
          <div className="relative h-48 md:h-64">
            <Image
              src={primaryResult.image}
              alt={primaryResult.coffeeRecommendation}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white/90 text-sm font-medium mb-1">
                Your perfect match
              </p>
              <p className="text-white text-2xl font-semibold">
                {primaryResult.coffeeRecommendation}
              </p>
            </div>
          </div>
          <div className="p-6">
            <p className="text-[#8b6f47] font-medium italic mb-3">
              &ldquo;{primaryResult.tagline}&rdquo;
            </p>
            <p className="text-[#5a4a3a] leading-relaxed mb-4">
              {primaryResult.description}
            </p>
            <div className="bg-[#f5e6d3] rounded-xl p-4">
              <p className="text-sm font-medium text-[#6b5635] mb-1">
                Why this drink?
              </p>
              <p className="text-[#5a4a3a]">{primaryResult.coffeeDescription}</p>
            </div>
          </div>
        </div>

        {/* Percentage breakdown */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-[#e8dcc8]">
          <h2 className="text-xl font-semibold text-[#3d2c1e] mb-4">
            Your Flavor Profile
          </h2>
          <div className="space-y-4">
            {results.map((result) => (
              <div key={result.id}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[#5a4a3a] font-medium">
                    {result.name}
                  </span>
                  <span className="text-[#8b6f47] font-semibold">
                    {result.percentage}%
                  </span>
                </div>
                <div className="h-3 bg-[#f5e6d3] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#8b6f47] rounded-full transition-all duration-500"
                    style={{ width: `${result.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Other recommendations */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-[#3d2c1e] mb-4">
            More Drinks to Try
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {results.slice(1).map((result) => (
              <div
                key={result.id}
                className="bg-white rounded-xl overflow-hidden shadow-md border border-[#e8dcc8]"
              >
                <div className="relative h-24">
                  <Image
                    src={result.image}
                    alt={result.coffeeRecommendation}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-3">
                  <p className="font-medium text-[#3d2c1e] text-sm">
                    {result.coffeeRecommendation}
                  </p>
                  <p className="text-[#8b7355] text-xs">{result.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Retake button */}
        <div className="text-center">
          <button
            onClick={handleRetake}
            className="bg-[#8b6f47] hover:bg-[#6b5635] text-white font-medium py-3 px-6 rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Retake Quiz
          </button>
          <p className="mt-4 text-sm text-[#8b7355]">
            See you soon at your local Basecamp!
          </p>
        </div>
      </div>
    </div>
  );
}
