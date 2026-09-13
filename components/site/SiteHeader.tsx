import Link from "next/link";
import { GraduationCap } from "lucide-react";

import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between gap-4 px-4 lg:px-8">
        <div className="flex min-w-0 items-center gap-6">
          <Link href="/" className="flex shrink-0 items-center no-underline">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-sm shadow-amber-500/30">
              <GraduationCap className="h-5 w-5" />
            </span>
          </Link>
          <nav className="hidden items-center gap-1 text-sm font-medium sm:flex">
            <Link
              href="/"
              className="rounded-lg px-3 py-2 text-muted-foreground no-underline transition-colors hover:bg-muted hover:text-foreground"
            >
              သင်တန်းများ
            </Link>
          </nav>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}