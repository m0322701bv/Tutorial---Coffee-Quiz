"use client";

import { useState, useEffect } from "react";
import { PersonalityResult, PersonalityType } from "@/app/quiz-data";

export default function PersonalitiesPage() {
  const [personalities, setPersonalities] = useState<
    Record<PersonalityType, PersonalityResult>
  >({} as Record<PersonalityType, PersonalityResult>);
  const [personalityOrder, setPersonalityOrder] = useState<PersonalityType[]>([]);
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
      setPersonalities(data.personalities || {});
      setPersonalityOrder(data.personalityOrder || []);
      setConfigured(data.configured);
    } catch (err) {
      setMessage({ type: "error", text: "Failed to load personalities" });
      console.error(err);
    }
    setLoading(false);
  };

  const handleChange = (
    id: PersonalityType,
    field: keyof PersonalityResult,
    value: string
  ) => {
    setPersonalities((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/admin/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personalities, personalityOrder }),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Personalities saved successfully!" });
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.error || "Failed to save" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Failed to save personalities" });
      console.error(err);
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#8b7355]">Loading personalities...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-[#3d2c1e]">
          Edit Personalities
        </h2>
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
        {personalityOrder.map((id) => {
          const personality = personalities[id];
          if (!personality) return null;

          return (
            <div
              key={id}
              className="bg-white rounded-xl p-6 border border-[#e8dcc8]"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#f5e6d3] rounded-full flex items-center justify-center text-2xl">
                  {id === "boldAdventurer" && "🚀"}
                  {id === "sweetEnthusiast" && "🍰"}
                  {id === "zenMinimalist" && "🧘"}
                  {id === "healthNut" && "🌱"}
                  {id === "indulgentTreat" && "👑"}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#3d2c1e]">
                    {personality.name}
                  </h3>
                  <p className="text-[#8b7355] text-sm">{id}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#8b7355] text-sm mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={personality.name}
                    onChange={(e) => handleChange(id, "name", e.target.value)}
                    className="w-full px-3 py-2 border-2 border-[#e8dcc8] rounded-lg focus:border-[#8b6f47] focus:outline-none text-[#3d2c1e]"
                  />
                </div>

                <div>
                  <label className="block text-[#8b7355] text-sm mb-1">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={personality.tagline}
                    onChange={(e) => handleChange(id, "tagline", e.target.value)}
                    className="w-full px-3 py-2 border-2 border-[#e8dcc8] rounded-lg focus:border-[#8b6f47] focus:outline-none text-[#3d2c1e]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[#8b7355] text-sm mb-1">
                    Description
                  </label>
                  <textarea
                    value={personality.description}
                    onChange={(e) =>
                      handleChange(id, "description", e.target.value)
                    }
                    rows={3}
                    className="w-full px-3 py-2 border-2 border-[#e8dcc8] rounded-lg focus:border-[#8b6f47] focus:outline-none text-[#3d2c1e] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[#8b7355] text-sm mb-1">
                    Coffee Recommendation
                  </label>
                  <input
                    type="text"
                    value={personality.coffeeRecommendation}
                    onChange={(e) =>
                      handleChange(id, "coffeeRecommendation", e.target.value)
                    }
                    className="w-full px-3 py-2 border-2 border-[#e8dcc8] rounded-lg focus:border-[#8b6f47] focus:outline-none text-[#3d2c1e]"
                  />
                </div>

                <div>
                  <label className="block text-[#8b7355] text-sm mb-1">
                    Image Path
                  </label>
                  <input
                    type="text"
                    value={personality.image}
                    onChange={(e) => handleChange(id, "image", e.target.value)}
                    className="w-full px-3 py-2 border-2 border-[#e8dcc8] rounded-lg focus:border-[#8b6f47] focus:outline-none text-[#3d2c1e]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[#8b7355] text-sm mb-1">
                    Coffee Description
                  </label>
                  <textarea
                    value={personality.coffeeDescription}
                    onChange={(e) =>
                      handleChange(id, "coffeeDescription", e.target.value)
                    }
                    rows={2}
                    className="w-full px-3 py-2 border-2 border-[#e8dcc8] rounded-lg focus:border-[#8b6f47] focus:outline-none text-[#3d2c1e] resize-none"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
