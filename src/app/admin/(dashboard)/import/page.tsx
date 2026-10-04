"use client";

import { useState } from "react";

type JobStatus = "imported" | "needs_review" | "duplicate" | "failed";

type ImportResult = {
  url: string;
  status: JobStatus;
  title?: string;
  author?: string;
  message?: string;
  bookId?: string;
};

export default function ImportBooksPage() {
  const [urlsText, setUrlsText] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [results, setResults] = useState<ImportResult[]>([]);
  const [phase, setPhase] = useState<"input" | "progress" | "review">("input");
  const [error, setError] = useState("");

  async function handleImport() {
    const urls = urlsText
      .split("\n")
      .map((u) => u.trim())
      .filter((u) => u.length > 0 && (u.startsWith("http://") || u.startsWith("https://")));

    if (urls.length === 0) {
      setError("کم از کم ایک درست URL درج کریں");
      return;
    }
    if (urls.length > 200) {
      setError("ایک بار میں زیادہ سے زیادہ 200 URLs");
      return;
    }

    setError("");
    setIsImporting(true);
    setPhase("progress");
    setProgress({ current: 0, total: urls.length });
    setResults([]);

    // Process in chunks of 5 for progress UI, single API call for reliability
    // For large lists we still send all — backend processes sequentially
    try {
      // Optimistic progress while waiting
      const progressTimer = setInterval(() => {
        setProgress((p) => ({
          current: Math.min(p.current + 1, p.total - 1),
          total: p.total,
        }));
      }, 800);

      const res = await fetch("/api/admin/import-books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls }),
      });

      clearInterval(progressTimer);

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "امپورٹ ناکام");
        setPhase("input");
        setIsImporting(false);
        return;
      }

      setResults(data.results || []);
      setProgress({ current: urls.length, total: urls.length });
      setPhase("review");
    } catch {
      setError("کنکشن میں مسئلہ۔ دوبارہ کوشش کریں۔");
      setPhase("input");
    }
    setIsImporting(false);
  }

  const statusIcon = (s: JobStatus) => {
    switch (s) {
      case "imported": return "✓";
      case "needs_review":
      case "duplicate": return "⚠";
      case "failed": return "✕";
    }
  };

  const statusColor = (s: JobStatus) => {
    switch (s) {
      case "imported": return "text-green-700 bg-green-50";
      case "needs_review":
      case "duplicate": return "text-amber-700 bg-amber-50";
      case "failed": return "text-red-700 bg-red-50";
    }
  };

  async function publishImported() {
    const ids = results
      .filter((r) => (r.status === "imported" || r.status === "needs_review") && r.bookId)
      .map((r) => r.bookId!);
    if (ids.length === 0) {
      setError("شائع کرنے کے لیے کوئی کتاب نہیں");
      return;
    }
    setIsImporting(true);
    try {
      const res = await fetch("/api/admin/books", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, action: "publish" }),
      });
      const data = await res.json();
      if (res.ok) {
        setError("");
        alert(`${data.count} کتاب(یں) شائع ہو گئیں`);
      } else {
        setError(data.error || "شائع نہیں ہو سکیں");
      }
    } catch {
      setError("کنکشن میں مسئلہ");
    }
    setIsImporting(false);
  }

  const statusLabel = (s: JobStatus) => {
    switch (s) {
      case "imported": return "درآمد شدہ";
      case "needs_review": return "جائزہ درکار";
      case "duplicate": return "ڈپلیکیٹ";
      case "failed": return "ناکام";
    }
  };

  return (
    <div>
      <h1 className="font-urdu text-2xl sm:text-3xl font-semibold text-burgundy-900 mb-2">
        امپورٹ کتابیں
      </h1>
      <p className="font-urdu text-charcoal-600 text-sm mb-8">
        ایک یا کئی کتابوں کے URLs پیسٹ کریں — فی لائن ایک URL
      </p>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 font-urdu text-sm">
          {error}
        </div>
      )}

      {phase === "input" && (
        <div className="bg-white rounded-2xl border border-cream-200 shadow-[var(--shadow-soft)] p-5 sm:p-6">
          <label className="block font-urdu text-sm text-charcoal-700 mb-2">
            کتابوں کے لنکس
          </label>
          <textarea
            value={urlsText}
            onChange={(e) => setUrlsText(e.target.value)}
            rows={12}
            placeholder={`https://example.com/book-one\nhttps://example.com/book-two\nhttps://example.com/book-three\n...`}
            className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-cream-50 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-600/30 focus:border-burgundy-600 resize-y min-h-[200px]"
            dir="ltr"
          />
          <p className="font-urdu text-xs text-charcoal-600 mt-2 mb-5">
            صرف میٹا ڈیٹا اور کور — کاپی رائٹ مواد خود بخود کاپی نہیں ہوتا۔ زیادہ سے زیادہ 200 فی درخواست۔
          </p>
          <button
            onClick={handleImport}
            disabled={!urlsText.trim() || isImporting}
            className="px-8 py-3 rounded-xl bg-burgundy-800 text-cream-50 font-urdu font-medium shadow-md hover:bg-burgundy-700 transition-colors disabled:opacity-50 active:scale-[0.98]"
          >
            IMPORT BOOKS
          </button>
        </div>
      )}

      {phase === "progress" && (
        <div className="bg-white rounded-2xl border border-cream-200 shadow-[var(--shadow-soft)] p-6 sm:p-8">
          <h2 className="font-urdu text-lg font-semibold text-burgundy-900 mb-4">
            Import Progress
          </h2>
          <p className="font-serif text-sm text-charcoal-600 mb-3">
            {progress.current} / {progress.total} processed
          </p>
          <div className="h-3 rounded-full bg-cream-200 overflow-hidden mb-6">
            <div
              className="h-full bg-burgundy-700 transition-all duration-300"
              style={{
                width: `${progress.total ? (progress.current / progress.total) * 100 : 0}%`,
              }}
            />
          </div>
          <p className="font-urdu text-sm text-charcoal-600">
            میٹا ڈیٹا حاصل کیا جا رہا ہے... براہِ کرم انتظار کریں۔
          </p>
        </div>
      )}

      {phase === "review" && (
        <div>
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => {
                setPhase("input");
                setResults([]);
                setUrlsText("");
                setError("");
              }}
              className="px-4 py-2 rounded-lg border border-cream-300 bg-white font-urdu text-sm hover:bg-cream-100"
            >
              نیا امپورٹ
            </button>
            <button
              onClick={publishImported}
              disabled={isImporting}
              className="px-4 py-2 rounded-lg bg-green-700 text-white font-urdu text-sm hover:bg-green-800 disabled:opacity-50"
            >
              سب شائع کریں
            </button>
            <a
              href="/admin/books"
              className="px-4 py-2 rounded-lg bg-burgundy-800 text-cream-50 font-urdu text-sm hover:bg-burgundy-700"
            >
              کتابیں منظم کریں
            </a>
            <a
              href="/admin"
              className="px-4 py-2 rounded-lg border border-cream-300 bg-white font-urdu text-sm hover:bg-cream-100"
            >
              ڈیش بورڈ
            </a>
          </div>

          <div className="flex flex-wrap gap-4 mb-4 font-urdu text-sm">
            <span className="text-green-700">✓ {results.filter((r) => r.status === "imported").length} درآمد</span>
            <span className="text-amber-700">⚠ {results.filter((r) => r.status === "needs_review").length} جائزہ</span>
            <span className="text-amber-700">⚠ {results.filter((r) => r.status === "duplicate").length} ڈپلیکیٹ</span>
            <span className="text-red-700">✕ {results.filter((r) => r.status === "failed").length} ناکام</span>
          </div>

          <div className="bg-white rounded-2xl border border-cream-200 shadow-[var(--shadow-soft)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-cream-100 border-b border-cream-200">
                  <tr>
                    <th className="px-4 py-3 text-right font-urdu font-medium">عنوان</th>
                    <th className="px-4 py-3 text-right font-urdu font-medium">مصنف</th>
                    <th className="px-4 py-3 text-right font-urdu font-medium">سورس</th>
                    <th className="px-4 py-3 text-right font-urdu font-medium">اسٹیٹس</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={i} className="border-b border-cream-100 hover:bg-cream-50">
                      <td className="px-4 py-3 font-urdu">{r.title || "—"}</td>
                      <td className="px-4 py-3 font-urdu">{r.author || "—"}</td>
                      <td className="px-4 py-3 font-mono text-xs truncate max-w-[180px]" dir="ltr">
                        {r.url}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-urdu ${statusColor(r.status)}`}
                        >
                          {statusIcon(r.status)} {statusLabel(r.status)}
                        </span>
                        {r.message && (
                          <p className="font-urdu text-[11px] text-charcoal-600 mt-0.5">{r.message}</p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="font-urdu text-xs text-charcoal-600 mt-4">
            ڈرافٹ کتابیں اب کتب خانے میں موجود ہیں۔ انہیں شائع کرنے کے لیے کتابیں صفحہ سے ترمیم کریں۔
          </p>
        </div>
      )}
    </div>
  );
}
