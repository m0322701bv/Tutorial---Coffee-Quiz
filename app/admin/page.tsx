"use client";

import { useState, useEffect } from "react";

interface Stats {
  totalResults: number;
  totalStarted: number;
  totalCompleted: number;
  completionRate: number;
  personalityDistribution: Record<string, number>;
  avgDurationSeconds: number;
  recentResults: Array<{
    id: string;
    personality: string;
    timestamp: { seconds: number };
  }>;
}

interface StatsResponse {
  configured: boolean;
  message?: string;
  stats: Stats;
}

const personalityNames: Record<string, string> = {
  boldAdventurer: "Bold Adventurer",
  sweetEnthusiast: "Sweet Enthusiast",
  zenMinimalist: "Zen Minimalist",
  healthNut: "Wellness Wanderer",
  indulgentTreat: "Indulgent Treat",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [configured, setConfigured] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data: StatsResponse = await res.json();
      setConfigured(data.configured);
      setStats(data.stats);
    } catch (err) {
      setError("Failed to load stats");
      console.error(err);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#8b7355]">Loading stats...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-xl">
        {error}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-[#3d2c1e] mb-6">Dashboard</h2>

      {!configured && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="text-amber-800">
            <strong>Firebase not configured.</strong> Add your Firebase credentials to{" "}
            <code className="bg-amber-100 px-1 rounded">.env.local</code> to enable
            data tracking.
          </p>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 border border-[#e8dcc8]">
          <p className="text-[#8b7355] text-sm font-medium">Total Completions</p>
          <p className="text-3xl font-semibold text-[#3d2c1e] mt-1">
            {stats?.totalResults || 0}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-[#e8dcc8]">
          <p className="text-[#8b7355] text-sm font-medium">Quiz Started</p>
          <p className="text-3xl font-semibold text-[#3d2c1e] mt-1">
            {stats?.totalStarted || 0}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-[#e8dcc8]">
          <p className="text-[#8b7355] text-sm font-medium">Completion Rate</p>
          <p className="text-3xl font-semibold text-[#3d2c1e] mt-1">
            {stats?.completionRate || 0}%
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-[#e8dcc8]">
          <p className="text-[#8b7355] text-sm font-medium">Avg. Duration</p>
          <p className="text-3xl font-semibold text-[#3d2c1e] mt-1">
            {stats?.avgDurationSeconds || 0}s
          </p>
        </div>
      </div>

      {/* Personality Distribution */}
      <div className="bg-white rounded-xl p-6 border border-[#e8dcc8] mb-8">
        <h3 className="text-lg font-semibold text-[#3d2c1e] mb-4">
          Personality Distribution
        </h3>
        {stats?.personalityDistribution &&
        Object.keys(stats.personalityDistribution).length > 0 ? (
          <div className="space-y-4">
            {Object.entries(stats.personalityDistribution).map(
              ([personality, count]) => {
                const total = Object.values(stats.personalityDistribution).reduce(
                  (a, b) => a + b,
                  0
                );
                const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={personality}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[#5a4a3a] font-medium">
                        {personalityNames[personality] || personality}
                      </span>
                      <span className="text-[#8b6f47] font-semibold">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-3 bg-[#f5e6d3] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#8b6f47] rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              }
            )}
          </div>
        ) : (
          <p className="text-[#8b7355]">No data yet</p>
        )}
      </div>

      {/* Recent Results */}
      <div className="bg-white rounded-xl p-6 border border-[#e8dcc8]">
        <h3 className="text-lg font-semibold text-[#3d2c1e] mb-4">
          Recent Results
        </h3>
        {stats?.recentResults && stats.recentResults.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e8dcc8]">
                  <th className="text-left py-2 text-[#8b7355] font-medium">
                    Personality
                  </th>
                  <th className="text-left py-2 text-[#8b7355] font-medium">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.recentResults.map((result) => (
                  <tr key={result.id} className="border-b border-[#f5e6d3]">
                    <td className="py-3 text-[#3d2c1e]">
                      {personalityNames[result.personality] || result.personality}
                    </td>
                    <td className="py-3 text-[#8b7355]">
                      {result.timestamp?.seconds
                        ? new Date(result.timestamp.seconds * 1000).toLocaleString()
                        : "Unknown"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-[#8b7355]">No results yet</p>
        )}
      </div>
    </div>
  );
}
