"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Cat = { id: string; name: string };
type Auth = { id: string; name: string };

export default function AddBookPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [description, setDescription] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [readingUrl, setReadingUrl] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [genre, setGenre] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [featured, setFeatured] = useState(false);
  const [categories, setCategories] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/books?status=all")
      .then(() =>
        // Load categories via a simple approach - from public data or we need categories API
        fetch("/api/books").then((r) => r.json())
      )
      .catch(() => {});
    // Categories from a lightweight endpoint - use settings or hardcode fetch from prisma via new route
    fetch("/api/admin/categories")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.categories) setCategories(d.categories);
      })
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("عنوان ضروری ہے");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/books/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          authorName: authorName.trim() || undefined,
          description: description.trim() || undefined,
          coverUrl: coverUrl.trim() || undefined,
          readingUrl: readingUrl.trim() || undefined,
          sourceUrl: sourceUrl.trim() || undefined,
          categoryId: categoryId || undefined,
          genre: genre.trim() || undefined,
          status,
          featured,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "محفوظ نہیں ہو سکی");
        setLoading(false);
        return;
      }
      router.push("/admin/books");
      router.refresh();
    } catch {
      setError("کنکشن میں مسئلہ");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-urdu text-2xl sm:text-3xl font-semibold text-burgundy-900 mb-6">
        کتاب شامل کریں
      </h1>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 font-urdu text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-cream-200 shadow-[var(--shadow-soft)] p-5 sm:p-6 space-y-4">
        <div>
          <label className="block font-urdu text-sm text-charcoal-700 mb-1">عنوان *</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-cream-300 bg-cream-50 font-urdu text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-600/30"
          />
        </div>
        <div>
          <label className="block font-urdu text-sm text-charcoal-700 mb-1">مصنف</label>
          <input
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-cream-300 bg-cream-50 font-urdu text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-600/30"
          />
        </div>
        <div>
          <label className="block font-urdu text-sm text-charcoal-700 mb-1">تفصیل</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-2.5 rounded-xl border border-cream-300 bg-cream-50 font-urdu text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-600/30"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-urdu text-sm text-charcoal-700 mb-1">زمرہ</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-cream-300 bg-cream-50 font-urdu text-sm"
            >
              <option value="">— منتخب کریں —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-urdu text-sm text-charcoal-700 mb-1">صنف</label>
            <input
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-cream-300 bg-cream-50 font-urdu text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block font-urdu text-sm text-charcoal-700 mb-1">کور URL</label>
          <input
            value={coverUrl}
            onChange={(e) => setCoverUrl(e.target.value)}
            dir="ltr"
            className="w-full px-4 py-2.5 rounded-xl border border-cream-300 bg-cream-50 font-mono text-sm"
          />
        </div>
        <div>
          <label className="block font-urdu text-sm text-charcoal-700 mb-1">پڑھنے کا URL</label>
          <input
            value={readingUrl}
            onChange={(e) => setReadingUrl(e.target.value)}
            dir="ltr"
            className="w-full px-4 py-2.5 rounded-xl border border-cream-300 bg-cream-50 font-mono text-sm"
          />
        </div>
        <div>
          <label className="block font-urdu text-sm text-charcoal-700 mb-1">سورس URL</label>
          <input
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            dir="ltr"
            className="w-full px-4 py-2.5 rounded-xl border border-cream-300 bg-cream-50 font-mono text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          <label className="flex items-center gap-2 font-urdu text-sm">
            <input
              type="radio"
              checked={status === "draft"}
              onChange={() => setStatus("draft")}
            />
            ڈرافٹ
          </label>
          <label className="flex items-center gap-2 font-urdu text-sm">
            <input
              type="radio"
              checked={status === "published"}
              onChange={() => setStatus("published")}
            />
            فوراً شائع کریں
          </label>
          <label className="flex items-center gap-2 font-urdu text-sm">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
            منتخب (Featured)
          </label>
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-burgundy-800 text-cream-50 font-urdu font-medium hover:bg-burgundy-700 disabled:opacity-50"
          >
            {loading ? "محفوظ ہو رہا ہے..." : "محفوظ کریں"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 rounded-xl border border-cream-300 font-urdu text-sm hover:bg-cream-100"
          >
            منسوخ
          </button>
        </div>
      </form>
    </div>
  );
}
