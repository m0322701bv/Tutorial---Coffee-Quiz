"use client";

import { useState, useEffect } from "react";

interface QuizResult {
  id: string;
  memberId?: string;
  personality: string;
  scores: Record<string, number>;
  timestamp: { seconds: number };
  duration?: number;
}

const personalityNames: Record<string, string> = {
  boldAdventurer: "Bold Adventurer",
  sweetEnthusiast: "Sweet Enthusiast",
  zenMinimalist: "Zen Minimalist",
  healthNut: "Wellness Wanderer",
  indulgentTreat: "Indulgent Treat",
};

export default function ResultsPage() {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(true);
  const [limit, setLimit] = useState(100);

  useEffect(() => {
    fetchResults();
  }, [limit]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/results?limit=${limit}`);
      const data = await res.json();
      setResults(data.results || []);
      setConfigured(data.configured);
    } catch (err) {
      console.error("Failed to fetch results:", err);
    }
    setLoading(false);
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "-";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-[#3d2c1e]">Quiz Results</h2>
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="px-4 py-2 border-2 border-[#e8dcc8] rounded-xl focus:border-[#8b6f47] focus:outline-none text-[#3d2c1e] bg-white"
        >
          <option value={50}>Last 50</option>
          <option value={100}>Last 100</option>
          <option value={250}>Last 250</option>
          <option value={500}>Last 500</option>
        </select>
      </div>

      {!configured && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="text-amber-800">
            <strong>Firebase not configured.</strong> Results will appear once
            Firebase is set up.
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-[#8b7355]">Loading results...</div>
        </div>
      ) : results.length === 0 ? (
        <div className="bg-white rounded-xl p-8 border border-[#e8dcc8] text-center">
          <p className="text-[#8b7355]">No quiz results yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#e8dcc8] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#faf7f2] border-b border-[#e8dcc8]">
                  <th className="text-left py-3 px-4 text-[#8b7355] font-medium">
                    #
                  </th>
                  <th className="text-left py-3 px-4 text-[#8b7355] font-medium">
                    Personality
                  </th>
                  <th className="text-left py-3 px-4 text-[#8b7355] font-medium">
                    Scores
                  </th>
                  <th className="text-left py-3 px-4 text-[#8b7355] font-medium">
                    Duration
                  </th>
                  <th className="text-left py-3 px-4 text-[#8b7355] font-medium">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr
                    key={result.id}
                    className="border-b border-[#f5e6d3] hover:bg-[#faf7f2]"
                  >
                    <td className="py-3 px-4 text-[#8b7355]">{index + 1}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-2 bg-[#f5e6d3] text-[#6b5635] px-3 py-1 rounded-full text-sm font-medium">
                        {personalityNames[result.personality] ||
                          result.personality}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1 flex-wrap">
                        {Object.entries(result.scores || {}).map(
                          ([key, value]) => (
                            <span
                              key={key}
                              className="text-xs bg-[#e8dcc8] text-[#5a4a3a] px-2 py-0.5 rounded"
                              title={personalityNames[key] || key}
                            >
                              {key.slice(0, 2).toUpperCase()}: {value}
                            </span>
                          )
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#5a4a3a]">
                      {formatDuration(result.duration)}
                    </td>
                    <td className="py-3 px-4 text-[#8b7355] text-sm">
                      {result.timestamp?.seconds
                        ? new Date(
                            result.timestamp.seconds * 1000
                          ).toLocaleString()
                        : "Unknown"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
