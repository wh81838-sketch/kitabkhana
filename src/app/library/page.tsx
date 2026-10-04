import { LibraryClient } from "@/components/books/LibraryClient";
import { getPublishedBooks, getCategories } from "@/lib/books";
import { demoBooks, categories as demoCategories } from "@/data/demo-books";
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
    books = dbBooks.length > 0 ? dbBooks : (demoBooks as unknown as BookCardData[]);
    categories = dbCats.length > 0 ? dbCats : (demoCategories as unknown as CategoryData[]);
  } catch {
    books = demoBooks as unknown as BookCardData[];
    categories = demoCategories as unknown as CategoryData[];
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <LibraryClient initialBooks={books} categories={categories} />
    </div>
  );
}
