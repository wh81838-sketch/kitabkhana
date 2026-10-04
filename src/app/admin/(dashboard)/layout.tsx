import Link from "next/link";
import { LogoutButton } from "@/components/admin/LogoutButton";

const sidebarItems = [
  { href: "/admin", label: "ڈیش بورڈ", icon: "📊" },
  { href: "/admin/books", label: "کتابیں", icon: "📚" },
  { href: "/admin/books/add", label: "کتاب شامل کریں", icon: "➕" },
  { href: "/admin/import", label: "امپورٹ کتابیں", icon: "🔗" },
  { href: "/admin/authors", label: "مصنفین", icon: "✍️" },
  { href: "/admin/categories", label: "زمرے", icon: "🏷️" },
  { href: "/admin/featured", label: "منتخب", icon: "❤️" },
  { href: "/admin/users", label: "صارفین", icon: "👥" },
  { href: "/admin/settings", label: "ترتیبات", icon: "⚙️" },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cream-100 flex">
      <aside className="hidden lg:flex flex-col w-64 bg-burgundy-900 text-cream-50 fixed inset-y-0 right-0 z-40">
        <div className="p-5 border-b border-burgundy-700">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-cream-50/10 flex items-center justify-center">
              <span className="font-serif text-lg">ک</span>
            </div>
            <div>
              <p className="font-urdu font-semibold text-sm">کتب خانہ</p>
              <p className="font-serif text-[10px] opacity-60">Admin</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-urdu text-sm hover:bg-burgundy-800 transition-colors"
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-burgundy-700">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-urdu text-sm hover:bg-burgundy-800 transition-colors opacity-80"
          >
            ← سائٹ دیکھیں
          </Link>
          <LogoutButton />
        </div>
      </aside>

      <div className="flex-1 lg:mr-64">
        <header className="lg:hidden sticky top-0 z-30 bg-burgundy-900 text-cream-50 px-4 h-14 flex items-center justify-between">
          <span className="font-urdu font-semibold">ایڈمن</span>
          <Link href="/" className="font-urdu text-sm opacity-80">سائٹ</Link>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
