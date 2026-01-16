"use client";

import { useState, useEffect } from "react";
import { QuizQuestion, PersonalityType } from "@/app/quiz-data";

const personalityOptions: { value: PersonalityType; label: string }[] = [
  { value: "boldAdventurer", label: "Bold Adventurer" },
  { value: "sweetEnthusiast", label: "Sweet Enthusiast" },
  { value: "zenMinimalist", label: "Zen Minimalist" },
  { value: "healthNut", label: "Wellness Wanderer" },
  { value: "indulgentTreat", label: "Indulgent Treat" },
];

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [configured, setConfigured] = useState(true);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch("/api/admin/config");
      const data = await res.json();
      setQuestions(data.questions || []);
      setConfigured(data.configured);
    } catch (err) {
      setMessage({ type: "error", text: "Failed to load questions" });
      console.error(err);
    }
    setLoading(false);
  };

  const handleQuestionChange = (index: number, value: string) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], question: value };
    setQuestions(updated);
  };

  const handleAnswerChange = (
    qIndex: number,
    aIndex: number,
    field: "text" | "icon" | "personality",
    value: string
  ) => {
    const updated = [...questions];
    updated[qIndex] = {
      ...updated[qIndex],
      answers: updated[qIndex].answers.map((ans, i) =>
        i === aIndex ? { ...ans, [field]: value } : ans
      ),
    };
    setQuestions(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/admin/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions }),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Questions saved successfully!" });
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.error || "Failed to save" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Failed to save questions" });
      console.error(err);
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#8b7355]">Loading questions...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-[#3d2c1e]">Edit Questions</h2>
        <button
          onClick={handleSave}
          disabled={saving || !configured}
          className="bg-[#8b6f47] hover:bg-[#6b5635] disabled:bg-[#c9a66b] text-white font-medium py-2 px-6 rounded-xl transition-all duration-200"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {!configured && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="text-amber-800">
            <strong>Firebase not configured.</strong> Changes cannot be saved until
            Firebase is set up. You can still edit locally.
          </p>
        </div>
      )}

      {message.text && (
        <div
          className={`mb-6 p-4 rounded-xl ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {questions.map((question, qIndex) => (
          <div
            key={qIndex}
            className="bg-white rounded-xl p-6 border border-[#e8dcc8]"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-[#8b6f47] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium">
                {qIndex + 1}
              </span>
              <span className="text-[#8b7355] text-sm">Question</span>
            </div>

            <input
              type="text"
              value={question.question}
              onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
              className="w-full px-4 py-3 border-2 border-[#e8dcc8] rounded-xl focus:border-[#8b6f47] focus:outline-none text-[#3d2c1e] mb-4"
            />

            <p className="text-[#8b7355] text-sm mb-3">Answers</p>
            <div className="space-y-3">
              {question.answers.map((answer, aIndex) => (
                <div
                  key={aIndex}
                  className="flex gap-3 items-start p-3 bg-[#faf7f2] rounded-lg"
                >
                  <input
                    type="text"
                    value={answer.icon}
                    onChange={(e) =>
                      handleAnswerChange(qIndex, aIndex, "icon", e.target.value)
                    }
                    className="w-16 px-2 py-2 border-2 border-[#e8dcc8] rounded-lg focus:border-[#8b6f47] focus:outline-none text-center text-xl"
                    placeholder="🎯"
                  />
                  <input
                    type="text"
                    value={answer.text}
                    onChange={(e) =>
                      handleAnswerChange(qIndex, aIndex, "text", e.target.value)
                    }
                    className="flex-1 px-3 py-2 border-2 border-[#e8dcc8] rounded-lg focus:border-[#8b6f47] focus:outline-none text-[#3d2c1e]"
                    placeholder="Answer text"
                  />
                  <select
                    value={answer.personality}
                    onChange={(e) =>
                      handleAnswerChange(
                        qIndex,
                        aIndex,
                        "personality",
                        e.target.value
                      )
                    }
                    className="w-48 px-3 py-2 border-2 border-[#e8dcc8] rounded-lg focus:border-[#8b6f47] focus:outline-none text-[#3d2c1e] bg-white"
                  >
                    {personalityOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
