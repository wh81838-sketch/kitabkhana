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
import { demoBooks, categories as demoCategories, authors as demoAuthors, personalGreeting as demoGreeting } from "@/data/demo-books";
import type { BookCardData } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let featured: BookCardData[] = [];
  let recentlyAdded: BookCardData[] = [];
  let categories = demoCategories;
  let authors = demoAuthors;
  let greeting = demoGreeting;
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

    if (feat.length > 0 || all.length > 0) {
      featured = feat.length > 0 ? feat : all.filter((b) => b.featured).slice(0, 8);
      recentlyAdded = recent.length > 0 ? recent : all.slice(0, 5);
      // Demo progress for continue-reading until real user progress exists
      continueReading = all
        .filter((b) => b.featured)
        .slice(0, 3)
        .map((b, i) => ({ ...b, readingProgress: [63, 12, 45][i] ?? 20 }));
    } else {
      // DB empty — fall back to demo data
      featured = demoBooks.filter((b) => b.featured) as unknown as BookCardData[];
      recentlyAdded = [...demoBooks]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5) as unknown as BookCardData[];
      continueReading = demoBooks
        .filter((b) => b.readingProgress && b.readingProgress > 0) as unknown as BookCardData[];
    }

    if (cats.length > 0) categories = cats as typeof demoCategories;
    if (auths.length > 0) authors = auths as typeof demoAuthors;
    if (settings.personal_greeting) greeting = settings.personal_greeting;
  } catch {
    // Prisma not available yet — pure demo mode
    featured = demoBooks.filter((b) => b.featured) as unknown as BookCardData[];
    recentlyAdded = [...demoBooks]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5) as unknown as BookCardData[];
    continueReading = demoBooks
      .filter((b) => b.readingProgress && b.readingProgress > 0) as unknown as BookCardData[];
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
