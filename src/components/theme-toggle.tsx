"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = React.useCallback(() => {
    if (!mounted || !resolvedTheme) return;
    // Toggle based on resolved theme after hydration
    setTheme(resolvedTheme === "light" ? "dark" : "light");
  }, [mounted, resolvedTheme, setTheme]);

  // Always render the same structure to avoid hydration mismatches
  // The icons use CSS classes that respond to the dark class on html,
  // which may differ between server and client - that's expected and handled
  // by suppressHydrationWarning on the html element in layout.tsx
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className="w-9 h-9 relative"
      aria-label="Toggle theme"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
