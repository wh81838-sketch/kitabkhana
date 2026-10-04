import { Hero } from "@/components/home/Hero";
import { ContinueReading } from "@/components/home/ContinueReading";
import { FeaturedBooks } from "@/components/home/FeaturedBooks";
import { RecentlyAdded } from "@/components/home/RecentlyAdded";
import { Categories } from "@/components/home/Categories";
import { Authors } from "@/components/home/Authors";
import { PersonalNote } from "@/components/home/PersonalNote";
import {
  getFeaturedBooks,
  getRecentlyAdded,
  getCategories,
  getAuthors,
  getSettings,
  getPublishedBooks,
} from "@/lib/books";
import type { BookCardData, CategoryData, AuthorData } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let featured: BookCardData[] = [];
  let recentlyAdded: BookCardData[] = [];
  let categories: CategoryData[] = [];
  let authors: AuthorData[] = [];
  let greeting =
    "تمہاری پسند کی کتابوں کے نام، ایک اپنی سی دنیا۔";
  let continueReading: BookCardData[] = [];

  try {
    const [feat, recent, cats, auths, settings, all] = await Promise.all([
      getFeaturedBooks(8),
      getRecentlyAdded(5),
      getCategories(),
      getAuthors(10),
      getSettings(),
      getPublishedBooks(),
    ]);

    // Only real DB data — no demo fallback when empty
    featured = feat.length > 0 ? feat : all.filter((b) => b.featured).slice(0, 8);
    recentlyAdded = recent.length > 0 ? recent : all.slice(0, 5);
    continueReading = []; // real progress later; hide section when empty
    categories = cats;
    authors = auths;
    if (settings.personal_greeting) greeting = settings.personal_greeting;
  } catch (e) {
    console.error("Home data error:", e);
  }

  return (
    <div>
      <Hero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PersonalNote message={greeting} />
        <ContinueReading books={continueReading} />
        <FeaturedBooks books={featured} />
        <RecentlyAdded books={recentlyAdded} />
        <Categories categories={categories} />
        <Authors authors={authors} />
        <div className="h-8" />
      </div>
    </div>
  );
}
