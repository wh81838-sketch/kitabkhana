"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

type AdminBook = {
  id: string;
  title: string;
  slug: string;
  status: string;
  featured: boolean;
  coverUrl: string | null;
  sourceUrl: string | null;
  createdAt: string;
  updatedAt: string;
  author: { name: string; slug: string } | null;
  category: { name: string; slug: string } | null;
};

type FilterStatus = "all" | "published" | "draft" | "archived";

export default function AdminBooksPage() {
  const [books, setBooks] = useState<AdminBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/books?status=${filter}`);
      if (res.ok) {
        const data = await res.json();
        setBooks(data.books || []);
      }
    } catch {
      setMessage("کتابیں لوڈ نہیں ہو سکیں");
    }
    setLoading(false);
    setSelected(new Set());
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = books.filter((b) => {
    if (!search.trim()) return true;
    const q = search.trim();
    return (
      b.title.includes(q) ||
      b.author?.name.includes(q) ||
      b.category?.name.includes(q)
    );
  });

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((b) => b.id)));
    }
  }

  async function runAction(action: "publish" | "unpublish" | "archive" | "feature" | "unfeature" | "delete") {
    const ids = [...selected];
    if (ids.length === 0) {
      setMessage("پہلے کتابیں منتخب کریں");
      return;
    }

    if (action === "delete" && !confirm(`${ids.length} کتاب(یں) حذف کریں؟`)) {
      return;
    }

    setBusy(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/books", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, action }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "عمل ناکام");
      } else {
        const labels: Record<string, string> = {
          publish: "شائع ہو گئیں",
          unpublish: "ڈرافٹ کر دی گئیں",
          archive: "آرکائیو ہو گئیں",
          feature: "منتخب کر دی گئیں",
          unfeature: "منتخب سے ہٹا دی گئیں",
          delete: "حذف ہو گئیں",
        };
        setMessage(`${data.count} کتاب(یں) ${labels[action]}`);
        await load();
      }
    } catch {
      setMessage("کنکشن میں مسئلہ");
    }
    setBusy(false);
  }

  async function toggleOneStatus(book: AdminBook) {
    const action = book.status === "published" ? "unpublish" : "publish";
    setBusy(true);
    try {
      await fetch("/api/admin/books", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [book.id], action }),
      });
      await load();
    } catch {
      setMessage("تبدیلی ناکام");
    }
    setBusy(false);
  }

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      published: "bg-green-50 text-green-700",
      draft: "bg-amber-50 text-amber-700",
      archived: "bg-gray-100 text-gray-600",
    };
    const labels: Record<string, string> = {
      published: "شائع شدہ",
      draft: "ڈرافٹ",
      archived: "آرکائیو",
    };
    return (
      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-urdu ${map[status] || "bg-cream-100"}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-urdu text-2xl sm:text-3xl font-semibold text-burgundy-900">کتابیں</h1>
          <p className="font-urdu text-sm text-charcoal-600 mt-1">
            {filtered.length} کتابیں
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/books/add"
            className="px-4 py-2 rounded-xl bg-burgundy-800 text-cream-50 font-urdu text-sm hover:bg-burgundy-700"
          >
            + کتاب شامل کریں
          </Link>
          <Link
            href="/admin/import"
            className="px-4 py-2 rounded-xl border border-cream-300 bg-white font-urdu text-sm hover:bg-cream-100"
          >
            امپورٹ
          </Link>
        </div>
      </div>

      {message && (
        <div className="mb-4 p-3 rounded-lg bg-cream-100 border border-cream-200 font-urdu text-sm text-charcoal-700">
          {message}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="search"
          placeholder="تلاش..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded-xl border border-cream-300 bg-white font-urdu text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-600/30"
        />
        <div className="flex rounded-xl border border-cream-300 overflow-hidden bg-white">
          {(["all", "published", "draft", "archived"] as FilterStatus[]).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-2 font-urdu text-xs sm:text-sm transition-colors ${
                filter === s ? "bg-burgundy-800 text-cream-50" : "text-charcoal-600 hover:bg-cream-100"
              }`}
            >
              {s === "all" ? "سب" : s === "published" ? "شائع" : s === "draft" ? "ڈرافٹ" : "آرکائیو"}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="flex flex-wrap gap-2 mb-4 p-3 rounded-xl bg-burgundy-900/5 border border-burgundy-800/10">
          <span className="font-urdu text-sm text-burgundy-900 self-center ml-2">
            {selected.size} منتخب
          </span>
          <button
            disabled={busy}
            onClick={() => runAction("publish")}
            className="px-3 py-1.5 rounded-lg bg-green-700 text-white font-urdu text-xs hover:bg-green-800 disabled:opacity-50"
          >
            شائع کریں
          </button>
          <button
            disabled={busy}
            onClick={() => runAction("unpublish")}
            className="px-3 py-1.5 rounded-lg bg-amber-600 text-white font-urdu text-xs hover:bg-amber-700 disabled:opacity-50"
          >
            ڈرافٹ کریں
          </button>
          <button
            disabled={busy}
            onClick={() => runAction("archive")}
            className="px-3 py-1.5 rounded-lg bg-gray-600 text-white font-urdu text-xs hover:bg-gray-700 disabled:opacity-50"
          >
            آرکائیو
          </button>
          <button
            disabled={busy}
            onClick={() => runAction("feature")}
            className="px-3 py-1.5 rounded-lg bg-burgundy-700 text-white font-urdu text-xs hover:bg-burgundy-800 disabled:opacity-50"
          >
            منتخب
          </button>
          <button
            disabled={busy}
            onClick={() => runAction("delete")}
            className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-urdu text-xs hover:bg-red-700 disabled:opacity-50"
          >
            حذف
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-cream-200 shadow-[var(--shadow-soft)] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center font-urdu text-charcoal-600">لوڈ ہو رہا ہے...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center font-urdu text-charcoal-600">کوئی کتاب نہیں ملی</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream-100 border-b border-cream-200">
                <tr>
                  <th className="px-3 py-3 text-right w-10">
                    <input
                      type="checkbox"
                      checked={selected.size === filtered.length && filtered.length > 0}
                      onChange={toggleAll}
                      className="rounded border-cream-300"
                    />
                  </th>
                  <th className="px-3 py-3 text-right font-urdu font-medium">عنوان</th>
                  <th className="px-3 py-3 text-right font-urdu font-medium hidden sm:table-cell">مصنف</th>
                  <th className="px-3 py-3 text-right font-urdu font-medium hidden md:table-cell">زمرہ</th>
                  <th className="px-3 py-3 text-right font-urdu font-medium">اسٹیٹس</th>
                  <th className="px-3 py-3 text-right font-urdu font-medium">عمل</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((book) => (
                  <tr key={book.id} className="border-b border-cream-100 hover:bg-cream-50">
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(book.id)}
                        onChange={() => toggle(book.id)}
                        className="rounded border-cream-300"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <div className="font-urdu font-medium text-charcoal-800 line-clamp-1">
                        {book.title}
                      </div>
                      {book.featured && (
                        <span className="text-[10px] text-gold-500 font-serif">★ featured</span>
                      )}
                    </td>
                    <td className="px-3 py-3 font-urdu text-charcoal-600 hidden sm:table-cell">
                      {book.author?.name || "—"}
                    </td>
                    <td className="px-3 py-3 font-urdu text-charcoal-600 hidden md:table-cell">
                      {book.category?.name || "—"}
                    </td>
                    <td className="px-3 py-3">{statusBadge(book.status)}</td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-1">
                        <button
                          disabled={busy}
                          onClick={() => toggleOneStatus(book)}
                          className={`px-2 py-1 rounded-lg text-xs font-urdu transition-colors disabled:opacity-50 ${
                            book.status === "published"
                              ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                              : "bg-green-50 text-green-700 hover:bg-green-100"
                          }`}
                        >
                          {book.status === "published" ? "ڈرافٹ" : "شائع"}
                        </button>
                        <Link
                          href={`/book/${book.slug}`}
                          className="px-2 py-1 rounded-lg text-xs font-urdu bg-cream-100 text-charcoal-600 hover:bg-cream-200"
                          target="_blank"
                        >
                          دیکھیں
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
