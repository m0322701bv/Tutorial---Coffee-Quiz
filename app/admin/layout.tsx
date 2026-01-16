"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // Check if already authenticated via cookie
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        setIsAuthenticated(true);
      }
    } catch {
      // Not authenticated
    }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setIsAuthenticated(true);
        setPassword("");
      } else {
        setError("Invalid password");
      }
    } catch {
      setError("Login failed");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setIsAuthenticated(false);
  };

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: "📊" },
    { href: "/admin/questions", label: "Questions", icon: "❓" },
    { href: "/admin/personalities", label: "Personalities", icon: "🎭" },
    { href: "/admin/results", label: "Results", icon: "📋" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf7f2]">
        <div className="text-[#8b7355]">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf7f2] p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 border border-[#e8dcc8]">
          <div className="text-center mb-6">
            <span className="text-4xl">🔐</span>
            <h1 className="text-2xl font-semibold text-[#3d2c1e] mt-4">
              Admin Dashboard
            </h1>
            <p className="text-[#8b7355] mt-2">
              Enter the admin password to continue
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 border-2 border-[#e8dcc8] rounded-xl focus:border-[#8b6f47] focus:outline-none text-[#3d2c1e]"
            />
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
            <button
              type="submit"
              className="w-full mt-4 bg-[#8b6f47] hover:bg-[#6b5635] text-white font-medium py-3 px-6 rounded-xl transition-all duration-200"
            >
              Login
            </button>
          </form>

          <Link
            href="/"
            className="block text-center mt-4 text-[#8b7355] hover:text-[#6b5635] text-sm"
          >
            ← Back to Quiz
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      {/* Header */}
      <header className="bg-white border-b border-[#e8dcc8] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">☕</span>
            <h1 className="text-xl font-semibold text-[#3d2c1e]">
              Basecamp Admin
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-[#8b7355] hover:text-[#6b5635] text-sm"
            >
              View Quiz →
            </Link>
            <button
              onClick={handleLogout}
              className="text-[#8b7355] hover:text-[#6b5635] text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar */}
        <nav className="w-64 min-h-[calc(100vh-73px)] bg-white border-r border-[#e8dcc8] p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    pathname === item.href
                      ? "bg-[#8b6f47] text-white"
                      : "text-[#5a4a3a] hover:bg-[#f5e6d3]"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
