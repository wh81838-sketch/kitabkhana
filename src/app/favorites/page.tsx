"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookCard } from "@/components/books/BookCard";
import { getFavoriteIds } from "@/lib/favorites-client";
import { demoBooks } from "@/data/demo-books";
import type { BookCardData } from "@/lib/types";

export default function FavoritesPage() {
  const [books, setBooks] = useState<BookCardData[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function load() {
      const ids = getFavoriteIds();
      let all: BookCardData[] = [];
      try {
        const res = await fetch("/api/books");
        if (res.ok) {
          const data = await res.json();
          all = data.books || [];
        }
      } catch {
        /* ignore */
      }
      if (all.length === 0) {
        all = demoBooks as unknown as BookCardData[];
      }
      const fav = all.filter((b) => ids.includes(b.id));
      setBooks(fav);
      setReady(true);
    }
    load();

    const onChange = () => load();
    window.addEventListener("kitabkhana-favorites", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("kitabkhana-favorites", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <h1 className="font-urdu text-2xl sm:text-3xl font-semibold text-burgundy-900 mb-2">
        میری پسندیدہ کتابیں
      </h1>
      <p className="font-urdu text-charcoal-600 text-sm mb-8">
        {ready ? `${books.length} کتابیں` : "لوڈ ہو رہا ہے..."}
      </p>

      {!ready ? (
        <div className="py-16 text-center font-urdu text-charcoal-600">لوڈ ہو رہا ہے...</div>
      ) : books.length === 0 ? (
        <div className="py-16 text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-cream-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-burgundy-700/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <p className="font-urdu text-charcoal-600 text-base leading-relaxed">
            ابھی کوئی کتاب پسندیدہ فہرست میں شامل نہیں۔
          </p>
          <p className="font-urdu text-sm text-charcoal-500">
            کسی کتاب پر دل کا نشان دبائیں — وہ یہاں محفوظ ہو جائے گی۔
          </p>
          <Link
            href="/library"
            className="inline-flex mt-2 px-5 py-2.5 rounded-xl bg-burgundy-800 text-cream-50 font-urdu text-sm hover:bg-burgundy-700"
          >
            لائبریری دیکھیں
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
