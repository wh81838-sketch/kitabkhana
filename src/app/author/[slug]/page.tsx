import Link from "next/link";
import { notFound } from "next/navigation";
import { getAuthorBySlug, getBooksByAuthorSlug } from "@/lib/books";
import { authors as demoAuthors, demoBooks } from "@/data/demo-books";
import { BookCard } from "@/components/books/BookCard";
import type { AuthorData, BookCardData } from "@/lib/types";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  try {
    const a = await getAuthorBySlug(slug);
    if (a) return { title: `${a.name} — کتب خانہ` };
  } catch {
    /* fall through */
  }
  const demo = demoAuthors.find((x) => x.slug === slug);
  return { title: demo ? `${demo.name} — کتب خانہ` : "مصنف" };
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params;
  let author: AuthorData | null = null;
  let books: BookCardData[] = [];

  try {
    author = await getAuthorBySlug(slug);
    if (author) books = await getBooksByAuthorSlug(slug);
  } catch {
    /* fallback */
  }

  if (!author) {
    const demo = demoAuthors.find((x) => x.slug === slug);
    if (demo) {
      author = {
        id: demo.id,
        name: demo.name,
        slug: demo.slug,
        biography: demo.biography,
        bookCount: demo.bookCount,
      };
      books = demoBooks
        .filter((b) => b.authorSlug === slug && b.status === "published")
        .map((b) => b as unknown as BookCardData);
    }
  }

  if (!author) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <Link
        href="/authors"
        className="inline-flex items-center gap-1 font-urdu text-sm text-burgundy-800 hover:underline mb-6"
      >
        <span className="inline-block rotate-180">←</span>
        تمام مصنفین
      </Link>

      <div className="flex items-start gap-5 mb-10">
        <div className="w-20 h-20 rounded-full bg-burgundy-900/10 flex items-center justify-center flex-shrink-0 font-urdu text-3xl text-burgundy-800">
          {author.name.charAt(0)}
        </div>
        <div>
          <h1 className="font-urdu text-2xl sm:text-3xl font-semibold text-burgundy-900 leading-relaxed">
            {author.name}
          </h1>
          <p className="font-urdu text-sm text-charcoal-600 mt-1">
            {books.length} کتابیں
          </p>
          {author.biography && (
            <p className="font-urdu text-base text-charcoal-700 leading-loose mt-4 max-w-2xl">
              {author.biography}
            </p>
          )}
        </div>
      </div>

      {books.length === 0 ? (
        <p className="font-urdu text-charcoal-600 py-8">اس مصنف کی کوئی شائع شدہ کتاب نہیں۔</p>
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
