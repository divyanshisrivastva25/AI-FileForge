export type Theme = "light" | "dark";

export const themeStorageKey = "fileforge-theme";

/** Resolve the theme the page should start in (stored choice, else OS preference). */
export function resolveInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  try {
    const stored = window.localStorage.getItem(themeStorageKey);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // storage can be unavailable (private mode) — fall through to OS preference
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** Apply a theme to the document root. Browser-only: call from effects/handlers. */
export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
}

/** Persist the choice and apply it. Browser-only. */
export function setTheme(theme: Theme) {
  try {
    window.localStorage.setItem(themeStorageKey, theme);
  } catch {
    // non-fatal: theme still applies for this session
  }
  applyTheme(theme);
}
