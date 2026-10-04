import Link from "next/link";
import type { BookCardData } from "@/lib/types";
import FavoriteButton from "@/components/books/FavoriteButton";

type Props = {
  book: BookCardData;
  showProgress?: boolean;
  compact?: boolean;
};

export function BookCard({ book, showProgress = false, compact = false }: Props) {
  return (
    <div className="group relative card-hover bg-white rounded-xl overflow-hidden border border-cream-200 shadow-[var(--shadow-soft)]">
      {/* Cover */}
      <div className={`relative ${compact ? "aspect-[3/4]" : "aspect-[2/3]"} overflow-hidden`}>
        <Link href={`/book/${book.slug}`} className="absolute inset-0 z-0 block">
          {book.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={book.coverUrl}
              alt={book.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="book-cover-placeholder w-full h-full">
              <span className="font-urdu text-sm sm:text-base font-medium leading-snug px-2 z-10">
                {book.title}
              </span>
              <span className="font-urdu text-xs opacity-80 mt-2 z-10">{book.author}</span>
            </div>
          )}
        </Link>

        {/* Favorite — interactive */}
        <div className="absolute top-2 left-2 z-10">
          <FavoriteButton bookId={book.id} variant="icon" />
        </div>

        {/* Progress bar */}
        {showProgress && book.readingProgress !== undefined && book.readingProgress > 0 && (
          <div className="absolute bottom-0 inset-x-0 h-1.5 bg-black/20 z-[5]">
            <div
              className="h-full bg-gold-400 transition-all"
              style={{ width: `${book.readingProgress}%` }}
            />
          </div>
        )}
      </div>

      {/* Info */}
      <Link href={`/book/${book.slug}`} className={`block p-3 ${compact ? "space-y-0.5" : "space-y-1"}`}>
        <h3 className="font-urdu font-semibold text-charcoal-800 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-burgundy-800 transition-colors">
          {book.title}
        </h3>
        <p className="font-urdu text-xs sm:text-sm text-charcoal-600 line-clamp-1">{book.author}</p>
        {!compact && (
          <p className="text-[11px] text-charcoal-600/80 font-serif tracking-wide">{book.category}</p>
        )}
        {showProgress && book.readingProgress !== undefined && book.readingProgress > 0 && (
          <p className="font-urdu text-xs text-burgundy-700 mt-1">{book.readingProgress}% مکمل</p>
        )}
      </Link>
    </div>
  );
}
