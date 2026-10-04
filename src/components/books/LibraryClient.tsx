"use client";

import { useState, useMemo } from "react";
import { BookCard } from "@/components/books/BookCard";
import type { BookCardData, CategoryData } from "@/lib/types";

type Props = {
  initialBooks: BookCardData[];
  categories: CategoryData[];
};

type ViewMode = "grid" | "list";
type SortBy = "newest" | "title" | "author";

export function LibraryClient({ initialBooks, categories }: Props) {
  const [view, setView] = useState<ViewMode>("grid");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<SortBy>("newest");

  const filtered = useMemo(() => {
    let result = [...initialBooks];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (b) =>
          b.title.includes(search) ||
          b.author.includes(search) ||
          b.alternateTitle?.toLowerCase().includes(q) ||
          b.description.includes(search)
      );
    }

    if (category !== "all") {
      result = result.filter((b) => b.categorySlug === category);
    }

    if (sort === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sort === "title") {
      result.sort((a, b) => a.title.localeCompare(b.title, "ur"));
    } else if (sort === "author") {
      result.sort((a, b) => a.author.localeCompare(b.author, "ur"));
    }

    return result;
  }, [initialBooks, search, category, sort]);

  return (
    <>
      <div className="mb-8">
        <h1 className="font-urdu text-2xl sm:text-3xl font-semibold text-burgundy-900 mb-2">
          کتب خانہ
        </h1>
        <p className="font-urdu text-charcoal-600 text-sm sm:text-base">
          {filtered.length} کتابیں دستیاب ہیں
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6 sticky top-16 z-30 bg-cream-50/95 backdrop-blur-sm py-3 -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-cream-200 sm:border-0">
        <div className="relative flex-1">
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            placeholder="کتاب، مصنف یا موضوع تلاش کریں..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-cream-300 bg-white font-urdu text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-600/30 focus:border-burgundy-600 transition-shadow"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-cream-300 bg-white font-urdu text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-600/30 min-w-[140px]"
        >
          <option value="all">تمام زمرے</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortBy)}
          className="px-4 py-2.5 rounded-xl border border-cream-300 bg-white font-urdu text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-600/30 min-w-[120px]"
        >
          <option value="newest">نئی سے پرانی</option>
          <option value="title">عنوان</option>
          <option value="author">مصنف</option>
        </select>

        <div className="flex rounded-xl border border-cream-300 overflow-hidden bg-white">
          <button
            onClick={() => setView("grid")}
            className={`px-3 py-2.5 transition-colors ${view === "grid" ? "bg-burgundy-800 text-cream-50" : "text-charcoal-600 hover:bg-cream-100"}`}
            aria-label="گرڈ ویو"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setView("list")}
            className={`px-3 py-2.5 transition-colors ${view === "list" ? "bg-burgundy-800 text-cream-50" : "text-charcoal-600 hover:bg-cream-100"}`}
            aria-label="لسٹ ویو"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-urdu text-lg text-charcoal-600 mb-2">اس نام سے کوئی کتاب نہیں ملی۔</p>
          <p className="font-urdu text-sm text-charcoal-600/80">شاید کسی اور نام سے تلاش کریں۔</p>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
          {filtered.map((book) => (
            <BookCard key={book.id} book={book} showProgress />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((book) => (
            <a
              key={book.id}
              href={`/book/${book.slug}`}
              className="flex gap-4 p-3 sm:p-4 rounded-xl bg-white border border-cream-200 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-card)] transition-shadow card-hover"
            >
              <div className="w-16 sm:w-20 aspect-[2/3] flex-shrink-0 rounded-lg overflow-hidden">
                <div className="book-cover-placeholder w-full h-full text-xs">
                  <span className="font-urdu leading-tight">{book.title}</span>
                </div>
              </div>
              <div className="flex-1 min-w-0 py-0.5">
                <h3 className="font-urdu font-semibold text-charcoal-800 text-base line-clamp-1">{book.title}</h3>
                <p className="font-urdu text-sm text-charcoal-600 mt-0.5">{book.author}</p>
                <p className="text-xs text-charcoal-600/70 mt-1 font-serif">{book.category}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </>
  );
}
