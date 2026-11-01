import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useHydrated } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { setTheme, type Theme } from "@/lib/theme";

export function ThemeToggle() {
  // The root shell's inline script has already set the correct class before
  // hydration; SSR renders a neutral placeholder so the two renders match.
  const hydrated = useHydrated();
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    if (!hydrated) return;
    setThemeState(
      document.documentElement.classList.contains("dark") ? "dark" : "light",
    );
  }, [hydrated]);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    setThemeState(next);
  };

  const label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="rounded-full"
    >
      {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}
