import { LibraryClient } from "@/components/books/LibraryClient";
import { getPublishedBooks, getCategories } from "@/lib/books";
import type { BookCardData, CategoryData } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  let books: BookCardData[] = [];
  let categories: CategoryData[] = [];

  try {
    const [dbBooks, dbCats] = await Promise.all([
      getPublishedBooks(),
      getCategories(),
    ]);
    // Real DB only — empty admin = empty library
    books = dbBooks;
    categories = dbCats;
  } catch (e) {
    console.error("Library data error:", e);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <LibraryClient initialBooks={books} categories={categories} />
    </div>
  );
}
