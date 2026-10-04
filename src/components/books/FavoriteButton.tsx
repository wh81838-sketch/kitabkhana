"use client";

import { useEffect, useState } from "react";
import { isFavorite, toggleFavorite } from "@/lib/favorites-client";

type Props = {
  bookId: string;
  /** full = labeled button on book page; icon = heart only on cards */
  variant?: "full" | "icon";
  className?: string;
};

export default function FavoriteButton({ bookId, variant = "full", className = "" }: Props) {
  const [active, setActive] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setActive(isFavorite(bookId));
    const onChange = () => setActive(isFavorite(bookId));
    window.addEventListener("kitabkhana-favorites", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("kitabkhana-favorites", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [bookId]);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleFavorite(bookId);
    setActive(added);
    setPulse(true);
    setTimeout(() => setPulse(false), 400);
  }

  if (!mounted) {
    // Avoid hydration mismatch
    if (variant === "icon") {
      return (
        <span
          className={`inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/90 shadow-sm ${className}`}
          aria-hidden
        />
      );
    }
    return (
      <span
        className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-cream-300 bg-white text-charcoal-700 font-urdu ${className}`}
        aria-hidden
      >
        پسندیدہ
      </span>
    );
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={active ? "پسندیدہ سے ہٹائیں" : "پسندیدہ میں شامل کریں"}
        aria-pressed={active}
        className={`inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/95 shadow-md border border-cream-200/80 backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-95 ${
          pulse ? "scale-125" : ""
        } ${className}`}
      >
        <svg
          className={`w-[18px] h-[18px] transition-colors duration-200 ${
            active ? "text-burgundy-700" : "text-charcoal-500"
          }`}
          fill={active ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.75}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={active ? "پسندیدہ سے ہٹائیں" : "پسندیدہ میں شامل کریں"}
      aria-pressed={active}
      className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl border font-urdu transition-all duration-200 active:scale-[0.98] ${
        active
          ? "border-burgundy-700/40 bg-burgundy-50 text-burgundy-900 shadow-sm"
          : "border-cream-300 bg-white text-charcoal-700 hover:bg-cream-100"
      } ${pulse ? "scale-[1.03]" : ""} ${className}`}
    >
      <svg
        className={`w-5 h-5 transition-all duration-200 ${active ? "text-burgundy-700 scale-110" : ""}`}
        fill={active ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.75}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span>{active ? "پسندیدہ ہے" : "پسندیدہ"}</span>
    </button>
  );
}
