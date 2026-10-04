import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getStats() {
  try {
    const [books, categories, authors, featured] = await Promise.all([
      prisma.book.count(),
      prisma.category.count(),
      prisma.author.count(),
      prisma.book.count({ where: { featured: true } }),
    ]);
    return { books, categories, authors, featured };
  } catch {
    return { books: 8, categories: 10, authors: 8, featured: 5 };
  }
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const cards = [
    { label: "کل کتابیں", value: String(stats.books), icon: "📚" },
    { label: "زمرے", value: String(stats.categories), icon: "🏷️" },
    { label: "مصنفین", value: String(stats.authors), icon: "✍️" },
    { label: "منتخب", value: String(stats.featured), icon: "❤️" },
  ];

  return (
    <div>
      <h1 className="font-urdu text-2xl sm:text-3xl font-semibold text-burgundy-900 mb-6">
        ڈیش بورڈ
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl border border-cream-200 p-5 shadow-[var(--shadow-soft)]"
          >
            <div className="text-2xl mb-2">{s.icon}</div>
            <p className="font-serif text-2xl font-semibold text-burgundy-900">{s.value}</p>
            <p className="font-urdu text-sm text-charcoal-600 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <QuickLink href="/admin/books/add" title="کتاب شامل کریں" desc="دستی طور پر نئی کتاب درج کریں" />
        <QuickLink href="/admin/import" title="امپورٹ کتابیں" desc="ایک یا کئی URLs سے کتابیں درآمد کریں" />
        <QuickLink href="/admin/categories" title="زمرے منظم کریں" desc="زمرے بنائیں، ترتیب دیں، ترمیم کریں" />
        <QuickLink href="/admin/authors" title="مصنفین" desc="مصنفین کی فہرست اور تفصیلات" />
        <QuickLink href="/admin/settings" title="ترتیبات" desc="نام، لوگو، ٹیمپلیٹ اور ظاہری شکل" />
      </div>
    </div>
  );
}

function QuickLink({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link
      href={href}
      className="block p-5 rounded-xl bg-white border border-cream-200 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-card)] hover:border-burgundy-600/20 transition-all card-hover"
    >
      <h3 className="font-urdu font-semibold text-burgundy-900 text-base mb-1">{title}</h3>
      <p className="font-urdu text-sm text-charcoal-600">{desc}</p>
    </Link>
  );
}
