"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Hide header on reader pages later
  if (pathname?.startsWith("/read/") || pathname?.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-40 bg-cream-50/95 backdrop-blur-md border-b border-cream-200 safe-top">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-burgundy-800 flex items-center justify-center shadow-sm">
              <span className="text-cream-50 text-lg font-serif">ک</span>
            </div>
            <div className="flex flex-col">
              <span className="font-urdu text-lg font-semibold text-burgundy-900 leading-tight group-hover:text-burgundy-700 transition-colors">
                کتب خانہ
              </span>
              <span className="hidden sm:block text-[10px] text-charcoal-600 font-serif tracking-wide">
                Urdu Adab Library
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink href="/" active={pathname === "/"}>
              ہوم
            </NavLink>
            <NavLink href="/library" active={pathname?.startsWith("/library")}>
              کتب خانہ
            </NavLink>
            <NavLink href="/search" active={pathname === "/search"}>
              تلاش
            </NavLink>
            <NavLink href="/favorites" active={pathname === "/favorites"}>
              پسندیدہ
            </NavLink>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-burgundy-800 hover:bg-cream-200 transition-colors"
            aria-label="مینو"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-cream-200 pt-3 space-y-1">
            <MobileLink href="/" onClick={() => setMenuOpen(false)}>ہوم</MobileLink>
            <MobileLink href="/library" onClick={() => setMenuOpen(false)}>کتب خانہ</MobileLink>
            <MobileLink href="/search" onClick={() => setMenuOpen(false)}>تلاش</MobileLink>
            <MobileLink href="/favorites" onClick={() => setMenuOpen(false)}>پسندیدہ</MobileLink>
            <MobileLink href="/profile" onClick={() => setMenuOpen(false)}>پروفائل</MobileLink>
          </div>
        )}
      </div>
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`px-4 py-2 rounded-lg font-urdu text-sm transition-colors ${
        active
          ? "bg-burgundy-800 text-cream-50"
          : "text-charcoal-700 hover:bg-cream-200 hover:text-burgundy-800"
      }`}
    >
      {children}
    </Link>
  );
}

function MobileLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-4 py-3 rounded-lg font-urdu text-base text-charcoal-800 hover:bg-cream-200 transition-colors"
    >
      {children}
    </Link>
  );
}
