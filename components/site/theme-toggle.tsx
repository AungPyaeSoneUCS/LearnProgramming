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
      className="p-2.5 rounded-xl bg-orange-100/50 dark:bg-orange-950/30 hover:bg-orange-200/50 dark:hover:bg-orange-900/50 text-orange-600 dark:text-orange-400 transition-colors duration-200 cursor-pointer"
    >
      <Sun className="w-5 h-5 dark:hidden" />
      <Moon className="w-5 h-5 hidden dark:block" />
    </button>
  );
}