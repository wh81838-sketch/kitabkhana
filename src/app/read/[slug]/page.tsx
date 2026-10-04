"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { demoBooks } from "@/data/demo-books";
import type { BookCardData } from "@/lib/types";

type Theme = "light" | "sepia" | "dark";
type FontSize = "sm" | "md" | "lg" | "xl";

export default function ReaderPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [book, setBook] = useState<BookCardData | null>(null);
  const [theme, setTheme] = useState<Theme>("sepia");
  const [fontSize, setFontSize] = useState<FontSize>("md");
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Prefer API, fall back to demo
    fetch("/api/books")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const found = data?.books?.find((b: BookCardData) => b.slug === slug);
        if (found) {
          // External reading link (Google Drive, etc.) → open it
          if (found.readingUrl) {
            window.location.href = found.readingUrl;
            return;
          }
          setBook(found);
        } else {
          const demo = demoBooks.find((b) => b.slug === slug);
          if (demo) {
            if (demo.readingUrl) {
              window.location.href = demo.readingUrl;
              return;
            }
            setBook(demo as unknown as BookCardData);
          }
        }
      })
      .catch(() => {
        const demo = demoBooks.find((b) => b.slug === slug);
        if (demo) {
          if (demo.readingUrl) {
            window.location.href = demo.readingUrl;
            return;
          }
          setBook(demo as unknown as BookCardData);
        }
      });
  }, [slug]);

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-urdu text-lg">کتاب لوڈ ہو رہی ہے...</p>
      </div>
    );
  }

  const themeClass =
    theme === "light" ? "reader-light" : theme === "sepia" ? "reader-sepia" : "reader-dark";

  const sizeClass =
    fontSize === "sm" ? "text-base" : fontSize === "md" ? "text-lg" : fontSize === "lg" ? "text-xl" : "text-2xl";

  const sampleContent = `
    یہ ایک نمونہ متن ہے۔ اصل کتاب کا مواد یہاں آئے گا جب منتظم اسے قانونی طور پر شامل کرے گا۔
    
    اس ڈیجیٹل کتب خانے کا مقصد اردو ادب کو خوبصورت اور آرام دہ انداز میں پیش کرنا ہے۔
    
    آپ فونٹ سائز، تھیم اور لائن اسپیسنگ اپنی مرضی کے مطابق تبدیل کر سکتے ہیں۔
    
    پڑھنے کا تجربہ پریشان کن عناصر سے پاک رکھا گیا ہے تاکہ آپ کہانی میں کھو سکیں۔
    
    — کتب خانہ
  `;

  return (
    <div className={`min-h-screen ${themeClass} transition-colors duration-300`}>
      <header className="sticky top-0 z-40 backdrop-blur-md border-b border-current/10 bg-inherit/90">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href={`/book/${book.slug}`}
            className="p-2 -mr-2 rounded-lg hover:bg-black/5 transition-colors"
            aria-label="واپس"
          >
            <svg className="w-5 h-5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="font-urdu text-sm font-medium truncate max-w-[50%]">{book.title}</h1>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 -ml-2 rounded-lg hover:bg-black/5 transition-colors font-serif text-sm font-medium"
            aria-label="ترتیبات"
          >
            Aa
          </button>
        </div>

        {showSettings && (
          <div className="border-t border-current/10 px-4 py-4 space-y-4 max-w-3xl mx-auto">
            <div>
              <p className="font-urdu text-xs mb-2 opacity-70">فونٹ سائز</p>
              <div className="flex gap-2">
                {(["sm", "md", "lg", "xl"] as FontSize[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setFontSize(s)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      fontSize === s ? "bg-current/15 font-medium" : "hover:bg-current/5"
                    }`}
                  >
                    {s === "sm" ? "چھوٹا" : s === "md" ? "درمیانہ" : s === "lg" ? "بڑا" : "بہت بڑا"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="font-urdu text-xs mb-2 opacity-70">تھیم</p>
              <div className="flex gap-2">
                {(["light", "sepia", "dark"] as Theme[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      theme === t ? "bg-current/15 font-medium" : "hover:bg-current/5"
                    }`}
                  >
                    {t === "light" ? "روشن" : t === "sepia" ? "سیپیا" : "تاریک"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      <article className="max-w-2xl mx-auto px-5 sm:px-8 py-10">
        <h2 className="font-urdu text-2xl font-semibold mb-8 text-center leading-relaxed">{book.title}</h2>

        {(book.readingUrl || book.sourceUrl) && (
          <div className="mb-10 p-5 rounded-2xl border border-current/15 text-center space-y-3">
            <p className="font-urdu text-base leading-relaxed opacity-90">
              یہ کتاب بیرونی لنک پر دستیاب ہے۔ پڑھنے کے لیے نیچے کلک کریں۔
            </p>
            <a
              href={book.readingUrl || book.sourceUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-burgundy-800 text-cream-50 font-urdu font-medium hover:bg-burgundy-700 transition-colors"
            >
              اصل ماخذ پر کھولیں
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        )}

        <div
          className={`font-urdu ${sizeClass} leading-[2.1] space-y-6 text-justify`}
          style={{ lineHeight: fontSize === "xl" ? 2.3 : 2.1 }}
        >
          {sampleContent
            .split("\n")
            .filter(Boolean)
            .map((para, i) => (
              <p key={i}>{para.trim()}</p>
            ))}
        </div>
      </article>

      <div className="fixed bottom-0 inset-x-0 h-1 bg-current/10">
        <div className="h-full bg-current/40" style={{ width: `${book.readingProgress || 5}%` }} />
      </div>
    </div>
  );
}
