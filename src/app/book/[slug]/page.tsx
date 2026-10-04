import Link from "next/link";
import { notFound } from "next/navigation";
import { getBookBySlug, getRelatedBooks } from "@/lib/books";
import { demoBooks } from "@/data/demo-books";
import type { BookCardData } from "@/lib/types";
import FavoriteButton from "@/components/books/FavoriteButton";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  let book: BookCardData | null = null;
  try {
    book = await getBookBySlug(slug);
  } catch {
    const demo = demoBooks.find((b) => b.slug === slug);
    if (demo) book = demo as unknown as BookCardData;
  }
  if (!book) return { title: "کتاب نہیں ملی" };
  return {
    title: book.title,
    description: book.description.slice(0, 160),
  };
}

export default async function BookDetailPage({ params }: Props) {
  const { slug } = await params;
  let book: BookCardData | null = null;
  let related: BookCardData[] = [];

  try {
    book = await getBookBySlug(slug);
    if (book) {
      related = await getRelatedBooks(book.categorySlug, book.id, 4);
    }
  } catch {
    // fallback to demo
  }

  if (!book) {
    const demo = demoBooks.find((b) => b.slug === slug);
    if (demo) {
      book = demo as unknown as BookCardData;
      related = demoBooks
        .filter((b) => b.categorySlug === demo.categorySlug && b.id !== demo.id)
        .slice(0, 4) as unknown as BookCardData[];
    }
  }

  if (!book) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="flex flex-col md:flex-row gap-8 md:gap-12">
        <div className="flex-shrink-0 mx-auto md:mx-0">
          <div className="w-48 sm:w-56 md:w-64 aspect-[2/3] rounded-xl overflow-hidden shadow-[var(--shadow-elevated)] border border-cream-200">
            {book.coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
            ) : (
              <div className="book-cover-placeholder w-full h-full">
                <span className="font-urdu text-lg font-medium px-4 leading-relaxed">{book.title}</span>
                <span className="font-urdu text-sm opacity-80 mt-3">{book.author}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0 space-y-4">
          <div>
            <p className="font-urdu text-sm text-burgundy-700 mb-1">
              {book.category}
              {book.genre && ` · ${book.genre}`}
            </p>
            <h1 className="font-urdu text-2xl sm:text-3xl md:text-4xl font-semibold text-burgundy-900 leading-relaxed">
              {book.title}
            </h1>
            {book.alternateTitle && (
              <p className="font-serif text-base text-charcoal-600 mt-1">{book.alternateTitle}</p>
            )}
          </div>

          {book.authorSlug ? (
            <Link
              href={`/author/${book.authorSlug}`}
              className="inline-block font-urdu text-lg text-charcoal-700 hover:text-burgundy-800 transition-colors"
            >
              {book.author}
            </Link>
          ) : (
            <p className="font-urdu text-lg text-charcoal-700">{book.author}</p>
          )}

          <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-charcoal-600 font-serif">
            {book.publicationYear && <span>{book.publicationYear}</span>}
            {book.pages && <span>{book.pages} صفحات</span>}
          </div>

          {book.readingProgress !== undefined && book.readingProgress > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full bg-cream-200 max-w-[200px]">
                <div className="h-full rounded-full bg-gold-400" style={{ width: `${book.readingProgress}%` }} />
              </div>
              <span className="font-urdu text-sm text-burgundy-700">{book.readingProgress}% مکمل</span>
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            {book.readingUrl ? (
              <a
                href={book.readingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-burgundy-800 text-cream-50 font-urdu font-medium shadow-md hover:bg-burgundy-700 transition-colors active:scale-[0.98]"
              >
                {book.readingProgress && book.readingProgress > 0 ? "جاری رکھیں" : "پڑھنا شروع کریں"}
                <svg className="w-4 h-4 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ) : (
              <Link
                href={`/read/${book.slug}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-burgundy-800 text-cream-50 font-urdu font-medium shadow-md hover:bg-burgundy-700 transition-colors active:scale-[0.98]"
              >
                {book.readingProgress && book.readingProgress > 0 ? "جاری رکھیں" : "پڑھنا شروع کریں"}
              </Link>
            )}
            <FavoriteButton bookId={book.id} variant="full" />
          </div>

          <div className="pt-4 border-t border-cream-200">
            <h2 className="font-urdu text-lg font-semibold text-burgundy-900 mb-3">کتاب کے بارے میں</h2>
            <p className="font-urdu text-base text-charcoal-700 leading-loose">{book.description}</p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-14 pt-8 border-t border-cream-200">
          <h2 className="font-urdu text-xl font-semibold text-burgundy-900 mb-5">اسی زمرے کی دیگر کتابیں</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
            {related.map((b) => (
              <Link key={b.id} href={`/book/${b.slug}`} className="group block">
                <div className="aspect-[2/3] rounded-xl overflow-hidden border border-cream-200 shadow-[var(--shadow-soft)] mb-2">
                  <div className="book-cover-placeholder w-full h-full text-sm">
                    <span className="font-urdu px-2">{b.title}</span>
                  </div>
                </div>
                <h3 className="font-urdu text-sm font-medium text-charcoal-800 group-hover:text-burgundy-800 line-clamp-1">{b.title}</h3>
                <p className="font-urdu text-xs text-charcoal-600">{b.author}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
