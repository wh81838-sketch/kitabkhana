/** Shared book shape used by UI components */
export type BookCardData = {
  id: string;
  slug: string;
  title: string;
  alternateTitle?: string | null;
  author: string;
  authorSlug: string;
  category: string;
  categorySlug: string;
  genre?: string | null;
  description: string;
  coverUrl?: string | null;
  publicationYear?: number | null;
  pages?: number | null;
  featured: boolean;
  status: string;
  readingProgress?: number;
  isFavorite?: boolean;
  sourceUrl?: string | null;
  readingUrl?: string | null;
  createdAt: string;
};

export type CategoryData = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  bookCount: number;
};

export type AuthorData = {
  id: string;
  name: string;
  slug: string;
  biography?: string | null;
  bookCount: number;
};
