import { BookCard } from "@/components/books/BookCard";
import { SectionHeader } from "./SectionHeader";
import type { BookCardData } from "@/lib/types";

type Props = {
  books: BookCardData[];
};

export function RecentlyAdded({ books }: Props) {
  if (books.length === 0) return null;

  return (
    <section className="py-8">
      <SectionHeader title="حال ہی میں شامل" href="/library?sort=newest" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
}
