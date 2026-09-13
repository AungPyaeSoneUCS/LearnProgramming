import type { TocItem } from "@/lib/mdx";

export interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  if (!items.length) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="sticky top-16 hidden max-h-[calc(100vh-5rem)] w-56 shrink-0 overflow-y-auto pb-10 pt-10 text-sm xl:block"
    >
      <h3 className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        အကြောင်းအရာများ
      </h3>
      <ul className="space-y-0.5 border-l border-border">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={"#" + item.id}
              className={`block border-l-2 border-transparent py-1 text-[13px] leading-snug text-muted-foreground no-underline transition-colors hover:border-amber-500/60 hover:text-foreground ${
                item.depth === 3 ? "pl-6" : item.depth === 4 ? "pl-9" : "pl-3"
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}