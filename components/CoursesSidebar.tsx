"use client";

import { usePathname } from "next/navigation";

import type { NavCourse, NavLeaf, NavGroup } from "@/lib/lessons";

export interface CoursesSidebarProps {
  courses: NavCourse[];
}

function isLeaf(item: NavLeaf | NavGroup): item is NavLeaf {
  return "slug" in item;
}

function collectLeaves(nodes: NavCourse["items"]): NavLeaf[] {
  const out: NavLeaf[] = [];
  for (const node of nodes) {
    if ("slug" in node && typeof node.slug === "string") {
      out.push({ label: node.label, slug: node.slug });
    } else if ("items" in node) {
      out.push(...collectLeaves(node.items));
    }
  }
  return out;
}

function toLessonHref(slug: string): string {
  return "/courses/" + slug.split("/").map(encodeURIComponent).join("/");
}

function NavLeafLink({ slug, label, activeSlug }: { slug: string; label: string; activeSlug: string }) {
  const active = slug === activeSlug;
  return (
    <a
      href={toLessonHref(slug)}
      aria-current={active ? "page" : undefined}
      className={
        "relative block rounded-lg py-1.5 pl-8 pr-2 text-[13px] leading-snug no-underline transition-colors " +
        (active
          ? "bg-amber-500/10 font-bold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground")
      }
    >
      {active && (
        <span
          aria-hidden="true"
          className="absolute left-2 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full bg-amber-500"
        />
      )}
      {label}
    </a>
  );
}

export default function CoursesSidebar({ courses }: CoursesSidebarProps) {
  const pathname = usePathname();
  const activeSlug = pathname.replace(/^\/courses\//, "");

  const activeCourse = courses.find((course) =>
    collectLeaves(course.items).some((leaf) => leaf.slug === activeSlug),
  );
  if (!activeCourse) return null;

  const intro = collectLeaves(activeCourse.items)[0];

  return (
    <nav className="text-sm">
      <div>
        <h3 className="mb-1.5 px-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
          {intro ? (
            <a
              href={toLessonHref(intro.slug)}
              className="block no-underline transition-colors hover:text-amber-700 dark:hover:text-amber-300"
            >
              {activeCourse.label}
            </a>
          ) : (
            activeCourse.label
          )}
        </h3>
        <ul className="space-y-0.5">
          {activeCourse.items.map((item) =>
            isLeaf(item) ? (
              <li key={item.slug}>
                <NavLeafLink slug={item.slug} label={item.label} activeSlug={activeSlug} />
              </li>
            ) : (
              <li key={item.label}>
                <p className="px-2 pb-0.5 pt-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                  {item.label}
                </p>
                <ul className="mt-1 space-y-0.5">
                  {item.items.map((leaf) => (
                    <li key={leaf.slug}>
                      <NavLeafLink slug={leaf.slug} label={leaf.label} activeSlug={activeSlug} />
                    </li>
                  ))}
                </ul>
              </li>
            ),
          )}
        </ul>
      </div>
    </nav>
  );
}