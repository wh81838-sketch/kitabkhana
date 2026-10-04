import Link from "next/link";
import { getAuthors } from "@/lib/books";
import { authors as demoAuthors } from "@/data/demo-books";
import type { AuthorData } from "@/lib/types";

export const metadata = {
  title: "مصنفین — کتب خانہ",
};

export default async function AuthorsPage() {
  let list: AuthorData[] = [];
  try {
    list = await getAuthors(100);
  } catch {
    list = demoAuthors.map((a) => ({
      id: a.id,
      name: a.name,
      slug: a.slug,
      biography: a.biography,
      bookCount: a.bookCount,
    }));
  }

  if (list.length === 0) {
    list = demoAuthors.map((a) => ({
      id: a.id,
      name: a.name,
      slug: a.slug,
      biography: a.biography,
      bookCount: a.bookCount,
    }));
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <h1 className="font-urdu text-2xl sm:text-3xl font-semibold text-burgundy-900 mb-2">
        مصنفین
      </h1>
      <p className="font-urdu text-sm text-charcoal-600 mb-8">
        {list.length} مصنفین
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((author) => (
          <Link
            key={author.id}
            href={`/author/${author.slug}`}
            className="group flex items-center gap-4 p-4 rounded-2xl bg-white border border-cream-200 shadow-[var(--shadow-soft)] hover:border-burgundy-700/20 hover:shadow-md transition-all"
          >
            <div className="w-14 h-14 rounded-full bg-burgundy-900/10 flex items-center justify-center flex-shrink-0 font-urdu text-xl text-burgundy-800">
              {author.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-urdu text-lg font-medium text-charcoal-800 group-hover:text-burgundy-800 transition-colors truncate">
                {author.name}
              </h2>
              <p className="font-urdu text-sm text-charcoal-600">
                {author.bookCount} کتابیں
              </p>
            </div>
            <svg
              className="w-5 h-5 text-charcoal-400 rotate-180 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}
