const MARKUP_STORAGE_KEY = "journalx:markups:v1";

export function loadMarkups<T>(fallback: T[]): T[] {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(MARKUP_STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed) || parsed.length === 0) return fallback;
    return parsed as T[];
  } catch {
    return fallback;
  }
}

export function saveMarkups<T>(markups: T[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(MARKUP_STORAGE_KEY, JSON.stringify(markups));
  } catch {
    // Prototype: ignore quota errors.
  }
}

export function clearStoredMarkups(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(MARKUP_STORAGE_KEY);
  } catch {
    // ignore
  }
}
