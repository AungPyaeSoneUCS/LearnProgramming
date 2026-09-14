"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import type { TocItem } from "@/lib/mdx";

export interface MobileTableOfContentsProps {
  items: TocItem[];
}

export function MobileTableOfContents({ items }: MobileTableOfContentsProps) {
  const [open, setOpen] = useState(false);
  if (!items.length) return null;

  return (
    <div className="mb-6 rounded-xl border border-border bg-card shadow-sm xl:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center justify-between gap-2 px-4 py-3 text-sm font-bold text-foreground"
      >
        <span className="inline-flex items-center gap-2">
          <span aria-hidden>📑</span>
          အကြောင်းအရာများ
        </span>
        <ChevronDown
          className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <ul className="max-h-72 space-y-0.5 overflow-y-auto border-t border-border px-4 py-3">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={"#" + item.id}
                onClick={() => setOpen(false)}
                className={`block rounded-lg py-1 text-[13px] leading-snug text-muted-foreground no-underline transition-colors hover:bg-amber-500/10 hover:text-foreground ${
                  item.depth === 3 ? "pl-6" : item.depth === 4 ? "pl-9" : "pl-3"
                }`}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}