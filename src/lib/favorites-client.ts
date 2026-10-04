/** Client-side favorites (localStorage) — perfect for a personal gift library */

const KEY = "kitabkhana_favorites";

export function getFavoriteIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export function isFavorite(bookId: string): boolean {
  return getFavoriteIds().includes(bookId);
}

export function toggleFavorite(bookId: string): boolean {
  const ids = getFavoriteIds();
  const i = ids.indexOf(bookId);
  let next: string[];
  let added: boolean;
  if (i >= 0) {
    next = ids.filter((id) => id !== bookId);
    added = false;
  } else {
    next = [...ids, bookId];
    added = true;
  }
  localStorage.setItem(KEY, JSON.stringify(next));
  // Notify other components on same page
  window.dispatchEvent(new CustomEvent("kitabkhana-favorites", { detail: next }));
  return added;
}

export function setFavorites(ids: string[]) {
  localStorage.setItem(KEY, JSON.stringify(ids));
  window.dispatchEvent(new CustomEvent("kitabkhana-favorites", { detail: ids }));
}
