import { prisma } from "./prisma";
import type { BookCardData, CategoryData, AuthorData } from "./types";

/** Map Prisma book (+ relations) to UI card shape */
function toBookCard(
  book: {
    id: string;
    slug: string;
    title: string;
    alternateTitle: string | null;
    description: string | null;
    coverUrl: string | null;
    genre: string | null;
    publicationYear: number | null;
    pages: number | null;
    featured: boolean;
    status: string;
    sourceUrl: string | null;
    readingUrl: string | null;
    createdAt: Date;
    author: { name: string; slug: string } | null;
    category: { name: string; slug: string } | null;
  },
  extras?: { readingProgress?: number; isFavorite?: boolean }
): BookCardData {
  return {
    id: book.id,
    slug: book.slug,
    title: book.title,
    alternateTitle: book.alternateTitle,
    author: book.author?.name ?? "نامعلوم",
    authorSlug: book.author?.slug ?? "",
    category: book.category?.name ?? "دیگر",
    categorySlug: book.category?.slug ?? "other",
    genre: book.genre,
    description: book.description ?? "",
    coverUrl: book.coverUrl,
    publicationYear: book.publicationYear,
    pages: book.pages,
    featured: book.featured,
    status: book.status,
    sourceUrl: book.sourceUrl,
    readingUrl: book.readingUrl,
    createdAt: book.createdAt.toISOString().slice(0, 10),
    readingProgress: extras?.readingProgress,
    isFavorite: extras?.isFavorite,
  };
}

const bookInclude = {
  author: { select: { name: true, slug: true } },
  category: { select: { name: true, slug: true } },
} as const;

/** All published books */
export async function getPublishedBooks(): Promise<BookCardData[]> {
  const books = await prisma.book.findMany({
    where: { status: "published" },
    include: bookInclude,
    orderBy: { createdAt: "desc" },
  });
  return books.map((b) => toBookCard(b));
}

/** Featured published books */
export async function getFeaturedBooks(limit = 10): Promise<BookCardData[]> {
  const books = await prisma.book.findMany({
    where: { status: "published", featured: true },
    include: bookInclude,
    orderBy: { updatedAt: "desc" },
    take: limit,
  });
  return books.map((b) => toBookCard(b));
}

/** Recently added */
export async function getRecentlyAdded(limit = 8): Promise<BookCardData[]> {
  const books = await prisma.book.findMany({
    where: { status: "published" },
    include: bookInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return books.map((b) => toBookCard(b));
}

/** Single book by slug */
export async function getBookBySlug(slug: string): Promise<BookCardData | null> {
  const book = await prisma.book.findUnique({
    where: { slug },
    include: bookInclude,
  });
  if (!book || book.status !== "published") return null;
  return toBookCard(book);
}

/** Related books in same category */
export async function getRelatedBooks(
  categorySlug: string,
  excludeId: string,
  limit = 4
): Promise<BookCardData[]> {
  const books = await prisma.book.findMany({
    where: {
      status: "published",
      category: { slug: categorySlug },
      id: { not: excludeId },
    },
    include: bookInclude,
    take: limit,
  });
  return books.map((b) => toBookCard(b));
}

/** Search books (title, author, description, category) */
export async function searchBooks(query: string): Promise<BookCardData[]> {
  if (!query.trim()) return [];
  const q = query.trim();
  const books = await prisma.book.findMany({
    where: {
      status: "published",
      OR: [
        { title: { contains: q } },
        { alternateTitle: { contains: q } },
        { description: { contains: q } },
        { author: { name: { contains: q } } },
        { category: { name: { contains: q } } },
        { genre: { contains: q } },
        { tags: { contains: q } },
      ],
    },
    include: bookInclude,
    orderBy: { createdAt: "desc" },
  });
  return books.map((b) => toBookCard(b));
}

/** Filter + sort for library page */
export async function getLibraryBooks(opts: {
  search?: string;
  categorySlug?: string;
  sort?: "newest" | "title" | "author";
}): Promise<BookCardData[]> {
  const where: Record<string, unknown> = { status: "published" };

  if (opts.categorySlug && opts.categorySlug !== "all") {
    where.category = { slug: opts.categorySlug };
  }

  if (opts.search?.trim()) {
    const q = opts.search.trim();
    where.OR = [
      { title: { contains: q } },
      { alternateTitle: { contains: q } },
      { description: { contains: q } },
      { author: { name: { contains: q } } },
      { genre: { contains: q } },
    ];
  }

  let orderBy: Record<string, string> = { createdAt: "desc" };
  if (opts.sort === "title") orderBy = { title: "asc" };
  // author sort done in JS after fetch (relation sort is limited in SQLite)

  const books = await prisma.book.findMany({
    where,
    include: bookInclude,
    orderBy,
  });

  let result = books.map((b) => toBookCard(b));
  if (opts.sort === "author") {
    result = result.sort((a, b) => a.author.localeCompare(b.author, "ur"));
  }
  return result;
}

/** Categories with book counts */
export async function getCategories(): Promise<CategoryData[]> {
  const cats = await prisma.category.findMany({
    where: { isVisible: true },
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { books: true } } },
  });
  return cats.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    bookCount: c._count.books,
  }));
}

/** Authors with book counts */
export async function getAuthors(limit = 12): Promise<AuthorData[]> {
  const authors = await prisma.author.findMany({
    orderBy: { name: "asc" },
    take: limit,
    include: { _count: { select: { books: true } } },
  });
  return authors.map((a) => ({
    id: a.id,
    name: a.name,
    slug: a.slug,
    biography: a.biography,
    bookCount: a._count.books,
  }));
}

/** Library settings (name, tagline, greeting) */
export async function getSettings(): Promise<Record<string, string>> {
  const rows = await prisma.setting.findMany();
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

/** Single author by slug */
export async function getAuthorBySlug(slug: string): Promise<AuthorData | null> {
  const a = await prisma.author.findUnique({
    where: { slug },
    include: { _count: { select: { books: true } } },
  });
  if (!a) return null;
  return {
    id: a.id,
    name: a.name,
    slug: a.slug,
    biography: a.biography,
    bookCount: a._count.books,
  };
}

/** Published books by author slug */
export async function getBooksByAuthorSlug(slug: string): Promise<BookCardData[]> {
  const books = await prisma.book.findMany({
    where: { status: "published", author: { slug } },
    include: bookInclude,
    orderBy: { title: "asc" },
  });
  return books.map((b) => toBookCard(b));
}
