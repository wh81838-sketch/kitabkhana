"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "لاگ ان ناکام");
        setLoading(false);
        return;
      }

      router.push(from);
      router.refresh();
    } catch {
      setError("کنکشن میں مسئلہ۔ دوبارہ کوشش کریں۔");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-50 px-4 paper-texture">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-xl bg-burgundy-800 flex items-center justify-center shadow-md mb-4">
            <span className="text-cream-50 text-2xl font-serif">ک</span>
          </div>
          <h1 className="font-urdu text-2xl font-semibold text-burgundy-900">ایڈمن لاگ ان</h1>
          <p className="font-serif text-sm text-charcoal-600 mt-1">Library Administration</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-cream-200 shadow-[var(--shadow-card)] p-6 sm:p-8 space-y-5"
        >
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-700 font-urdu text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block font-urdu text-sm text-charcoal-700 mb-1.5">
              ای میل / یوزر نیم
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-cream-50 font-urdu text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-600/30 focus:border-burgundy-600"
              placeholder="admin@kitabkhana.local"
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label className="block font-urdu text-sm text-charcoal-700 mb-1.5">پاس ورڈ</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-cream-50 font-urdu text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-600/30 focus:border-burgundy-600"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-cream-300 text-burgundy-800 focus:ring-burgundy-600"
              />
              <span className="font-urdu text-sm text-charcoal-700">مجھے یاد رکھیں</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-burgundy-800 text-cream-50 font-urdu font-medium text-base shadow-md hover:bg-burgundy-700 transition-colors disabled:opacity-60 active:scale-[0.98]"
          >
            {loading ? "لاگ ان ہو رہا ہے..." : "لاگ ان"}
          </button>
        </form>

        <p className="text-center mt-6 font-serif text-xs text-charcoal-600">
          Default: admin@kitabkhana.local / admin123
        </p>
        <p className="text-center mt-2 font-serif text-xs text-charcoal-600">
          This page is not linked in public navigation.
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream-50" />}>
      <LoginForm />
    </Suspense>
  );
}
