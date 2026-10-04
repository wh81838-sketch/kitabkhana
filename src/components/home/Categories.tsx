import Link from "next/link";
import { SectionHeader } from "./SectionHeader";
import type { CategoryData } from "@/lib/types";

type Props = {
  categories: CategoryData[];
};

export function Categories({ categories }: Props) {
  return (
    <section className="py-8">
      <SectionHeader title="مشہور زمرے" href="/library" linkText="تمام زمرے" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/library?category=${cat.slug}`}
            className="group p-4 sm:p-5 rounded-xl bg-white border border-cream-200 shadow-[var(--shadow-soft)] hover:border-burgundy-600/30 hover:shadow-[var(--shadow-card)] transition-all card-hover"
          >
            <div className="w-10 h-10 rounded-lg bg-burgundy-800/10 flex items-center justify-center mb-3 group-hover:bg-burgundy-800/15 transition-colors">
              <svg className="w-5 h-5 text-burgundy-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="font-urdu font-medium text-charcoal-800 text-sm sm:text-base group-hover:text-burgundy-800 transition-colors">
              {cat.name}
            </h3>
            <p className="text-xs text-charcoal-600 mt-1 font-serif">
              {cat.bookCount} کتابیں
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
