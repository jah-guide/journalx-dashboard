export const THEME_STORAGE_KEY = "journalx-theme";

export type Theme = "light" | "dark";

export function resolveTheme(stored: Theme | null): Theme {
  if (stored === "light" || stored === "dark") return stored;
  return "dark";
}

export function readStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    if (value === "light" || value === "dark") return value;
  } catch {
    /* ignore */
  }
  return null;
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

export function persistTheme(theme: Theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* ignore */
  }
  applyTheme(theme);
}

export function readAppliedTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export const themeInitScript = `(function(){try{var k="journalx-theme";var s=localStorage.getItem(k);var dark=s!=="light"&&(s==="dark"||!s);document.documentElement.classList.toggle("dark",dark);document.documentElement.style.colorScheme=dark?"dark":"light";}catch(e){document.documentElement.classList.add("dark");}})();`;
