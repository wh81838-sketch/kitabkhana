"use client";

import { useState, useEffect, useMemo } from "react";
import { BookCard } from "@/components/books/BookCard";
import { demoBooks } from "@/data/demo-books";
import type { BookCardData } from "@/lib/types";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<BookCardData[]>(demoBooks as unknown as BookCardData[]);

  useEffect(() => {
    // Client-side search against loaded books.
    // When API routes are added, this can call /api/search?q=...
    fetch("/api/books")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.books?.length) setBooks(data.books);
      })
      .catch(() => {
        /* keep demo */
      });
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return books.filter(
      (b) =>
        b.title.includes(query) ||
        b.author.includes(query) ||
        b.alternateTitle?.toLowerCase().includes(q) ||
        b.description.includes(query) ||
        b.category.includes(query)
    );
  }, [query, books]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <h1 className="font-urdu text-2xl sm:text-3xl font-semibold text-burgundy-900 mb-6">تلاش</h1>

      <div className="relative mb-8">
        <svg
          className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          autoFocus
          placeholder="بانو قدسیہ، راجہ گدھ، یا کوئی اور..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pr-12 pl-5 py-4 rounded-2xl border border-cream-300 bg-white font-urdu text-base shadow-[var(--shadow-soft)] focus:outline-none focus:ring-2 focus:ring-burgundy-600/30 focus:border-burgundy-600 transition-shadow"
        />
      </div>

      {!query.trim() ? (
        <div className="text-center py-16">
          <p className="font-urdu text-charcoal-600">کتاب، مصنف یا موضوع کا نام لکھیں</p>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-16">
          <p className="font-urdu text-lg text-charcoal-600 mb-2">اس نام سے کوئی کتاب نہیں ملی۔</p>
          <p className="font-urdu text-sm text-charcoal-600/80">شاید کسی اور نام سے تلاش کریں۔</p>
        </div>
      ) : (
        <>
          <p className="font-urdu text-sm text-charcoal-600 mb-5">{results.length} نتائج ملے</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
            {results.map((book) => (
              <BookCard key={book.id} book={book} showProgress />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
