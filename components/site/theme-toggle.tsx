"use client";

import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const toggle = () => {
    const h = document.documentElement;
    const next = !h.classList.contains("dark");
    const system = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    if (next.toString() === system) {
      localStorage.removeItem("theme-toggle");
    } else {
      localStorage.setItem("theme-toggle", next ? "dark" : "light");
    }
    h.classList.toggle("dark", next);
    h.dataset.theme = next ? "dark" : "light";
    h.style.colorScheme = next ? "dark" : "light";
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="btn btn-icon bg-orange-100/50 text-orange-600 hover:bg-orange-200/60 hover:text-orange-700 dark:bg-orange-950/30 dark:text-orange-400 dark:hover:bg-orange-900/50 dark:hover:text-orange-300"
    >
      <Sun className="w-5 h-5 dark:hidden" />
      <Moon className="w-5 h-5 hidden dark:block" />
    </button>
  );
}