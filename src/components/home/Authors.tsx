import Link from "next/link";
import { SectionHeader } from "./SectionHeader";
import type { AuthorData } from "@/lib/types";

type Props = {
  authors: AuthorData[];
};

export function Authors({ authors }: Props) {
  return (
    <section className="py-8">
      <SectionHeader title="مصنفین" href="/authors" linkText="تمام مصنفین" />
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        {authors.map((author) => (
          <Link
            key={author.id}
            href={`/author/${author.slug}`}
            className="flex-shrink-0 w-32 sm:w-36 group"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-burgundy-800/10 border-2 border-cream-200 group-hover:border-burgundy-600/40 transition-colors flex items-center justify-center mb-3 overflow-hidden">
              <span className="font-urdu text-2xl text-burgundy-700">
                {author.name.charAt(0)}
              </span>
            </div>
            <h3 className="font-urdu text-sm text-center text-charcoal-800 group-hover:text-burgundy-800 transition-colors line-clamp-2">
              {author.name}
            </h3>
            <p className="text-[11px] text-center text-charcoal-600 mt-0.5 font-serif">
              {author.bookCount} کتابیں
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
