"use client";

import { Children, isValidElement, useState, type ReactElement, type ReactNode } from "react";

export default function Tabs({ children }: { children?: ReactNode }) {
  const items = Children.toArray(children).filter(isValidElement) as ReactElement[];
  const [active, setActive] = useState(0);

  const labels = items.map((it) => {
    const props = (it.props ?? {}) as { label?: string };
    return props.label ?? "";
  });

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-border">
      <div role="tablist" aria-label="Tabs" className="flex overflow-x-auto border-b border-border bg-muted/50">
        {labels.map((label, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={`shrink-0 cursor-pointer px-4 py-2 text-sm font-semibold transition-colors ${
              i === active
                ? "border-b-2 border-amber-500 text-amber-600 dark:text-amber-400"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="not-prose p-4">{items[active]}</div>
    </div>
  );
}