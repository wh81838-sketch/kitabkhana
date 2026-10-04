import Link from "next/link";

type Props = {
  title: string;
  href?: string;
  linkText?: string;
};

export function SectionHeader({ title, href, linkText = "سب دیکھیں" }: Props) {
  return (
    <div className="flex items-center justify-between mb-5">
      <h2 className="font-urdu text-xl sm:text-2xl font-semibold text-burgundy-900">
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          className="font-urdu text-sm text-burgundy-700 hover:text-burgundy-900 flex items-center gap-1 transition-colors"
        >
          {linkText}
          <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </div>
  );
}
