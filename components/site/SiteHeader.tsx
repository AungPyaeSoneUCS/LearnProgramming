"use client";

import Link from "next/link";
import { useState } from "react";
import { GraduationCap, Menu, X } from "lucide-react";

import { ThemeToggle } from "./theme-toggle";

const GITHUB_URL = "https://github.com/AungPyaeSoneUCS/LearnProgramming";

const GITHUB_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between gap-2 px-4 lg:px-8">
        <div className="flex min-w-0 items-center gap-2">
          <Link
            href="/"
            onClick={close}
            className="group flex shrink-0 items-center gap-2.5 no-underline"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-sm shadow-amber-500/30 transition-transform duration-200 group-hover:scale-105">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="hidden sm:block">
              <span className="block text-[15px] font-extrabold leading-tight tracking-tight text-foreground">
                Learn<span className="text-amber-600 dark:text-amber-400">Programming</span>
              </span>
              <span className="block text-[11px] font-medium leading-tight text-muted-foreground">
                Myanmar Tech Learning Platform
              </span>
            </span>
          </Link>
          <nav className="ml-4 hidden items-center gap-1 text-sm font-medium md:flex">
            <Link
              href="/"
              className="rounded-lg px-3 py-2 text-muted-foreground no-underline transition-colors hover:bg-muted hover:text-foreground"
            >
              သင်တန်းများ
            </Link>
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <Link
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Repository"
            className="btn btn-icon btn-ghost"
          >
            {GITHUB_ICON}
          </Link>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="site-mobile-nav"
            aria-label="Navigation menu"
            className="btn btn-icon btn-ghost lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="site-mobile-nav"
          className="animate-menu-in border-t border-border bg-background/95 backdrop-blur-md lg:hidden"
        >
          <nav className="mx-auto flex max-w-[1500px] flex-col gap-1 px-4 py-3">
            <Link
              href="/"
              onClick={close}
              className="rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground no-underline transition-colors hover:bg-amber-500/10 hover:text-amber-700 dark:hover:text-amber-300"
            >
              သင်တန်းများ — Courses
            </Link>
            <Link
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted-foreground no-underline transition-colors hover:bg-amber-500/10 hover:text-amber-700 dark:hover:text-amber-300"
            >
              {GITHUB_ICON}
              GitHub — Source Code
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}