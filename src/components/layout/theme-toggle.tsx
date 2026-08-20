"use client";

import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useUIStore } from "@/stores/ui-store";

interface ThemeToggleProps {
  collapsed?: boolean;
  className?: string;
  variant?: "default" | "icon" | "pill";
}

export function ThemeToggle({
  collapsed = false,
  className = "",
  variant = "default",
}: ThemeToggleProps) {
  const theme = useUIStore((s) => s.theme);
  const setTheme = useUIStore((s) => s.setTheme);

  // Sync the store with whatever the pre-hydration script in the root
  // layout applied to <html> from the persisted preference.
  useEffect(() => {
    try {
      const saved = localStorage.getItem("menustudio-theme");
      if ((saved === "light" || saved === "dark") && saved !== useUIStore.getState().theme) {
        useUIStore.setState({ theme: saved });
      }
    } catch {
      /* storage unavailable */
    }
  }, []);

  const isDark = theme === "dark";

  const handleToggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleToggle}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        className={`flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition-all hover:bg-white/10 hover:text-white ${className}`}
      >
        {isDark ? (
          <Sun className="h-4 w-4 text-amber-400" />
        ) : (
          <Moon className="h-4 w-4 text-indigo-500" />
        )}
      </button>
    );
  }

  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={handleToggle}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        className={`inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/70 transition-all hover:bg-white/10 hover:text-white ${className}`}
      >
        {isDark ? (
          <>
            <Sun className="h-4 w-4 text-amber-400" />
            <span>Light Mode</span>
          </>
        ) : (
          <>
            <Moon className="h-4 w-4 text-indigo-500" />
            <span>Dark Mode</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/40 transition-colors hover:bg-white/5 hover:text-white/60 ${className}`}
    >
      {isDark ? (
        <Sun className="h-5 w-5 shrink-0 text-amber-400" />
      ) : (
        <Moon className="h-5 w-5 shrink-0 text-indigo-500" />
      )}
      {!collapsed && <span>{isDark ? "Light Mode" : "Dark Mode"}</span>}
    </button>
  );
}
