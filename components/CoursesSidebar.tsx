"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

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
    if (isLeaf(node)) {
      out.push(node);
    } else {
      out.push(...collectLeaves((node as NavGroup).items));
    }
  }
  return out;
}

/** Path (dot notation of group indices) to the group that contains `slug`. */
function groupPathOf(nodes: NavCourse["items"], slug: string, prefix = ""): string | null {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (isLeaf(node)) {
      if (node.slug === slug) return prefix;
    } else {
      const childPath = groupPathOf((node as NavGroup).items, slug, prefix ? `${prefix}.${i}` : `${i}`);
      if (childPath !== null) return childPath;
    }
  }
  return null;
}

function toLessonHref(slug: string): string {
  return "/courses/" + slug.split("/").map(encodeURIComponent).join("/");
}

function stripModule(label: string): string {
  return label.replace(/^Module\s+\d+\s*:\s*/i, "").trim();
}

/** A group that holds a single lesson whose label just repeats the Module title. */
function shouldFlatten(group: NavGroup): boolean {
  if (group.items.length !== 1 || !isLeaf(group.items[0])) return false;
  const norm = stripModule(group.label);
  return norm !== "" && norm === stripModule(group.items[0].label);
}

const GROUP_PAD = 6;
const LEVEL_STEP = 12;
const CHEVRON_SPACE = 18; // chevron 14px + gap 4px
const LEAF_GAP = 10; // nesting gap of a lesson under its Module

function groupPad(level: number): number {
  return GROUP_PAD + (level - 1) * LEVEL_STEP;
}

function leafPad(level: number): number {
  if (level <= 1) return GROUP_PAD + CHEVRON_SPACE + 2;
  return groupPad(level - 1) + CHEVRON_SPACE + LEAF_GAP;
}

function NavLeafLink({
  slug,
  label,
  activeSlug,
  level,
}: {
  slug: string;
  label: string;
  activeSlug: string;
  level: number;
}) {
  const pad = leafPad(level);
  const active = slug === activeSlug;
  return (
    <a
      href={toLessonHref(slug)}
      aria-current={active ? "page" : undefined}
      className={
        "relative block rounded-lg py-1.5 pr-2 text-[13px] leading-snug no-underline transition-colors " +
        (active
          ? "bg-amber-500/10 font-bold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground")
      }
      style={{ paddingLeft: `${pad}px` }}
    >
      {active && (
        <span
          aria-hidden="true"
          className="absolute top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full bg-amber-500"
          style={{ left: `${pad - 4}px` }}
        />
      )}
      {label}
    </a>
  );
}

interface GroupSectionProps {
  label: string;
  items: NavLeaf[];
  path: string;
  level: number;
  openSet: Set<string>;
  onToggle: (path: string) => void;
  activeSlug: string;
}

function GroupSection({ label, items, path, level, openSet, onToggle, activeSlug }: GroupSectionProps) {
  const open = openSet.has(path);
  return (
    <li>
      <button
        type="button"
        onClick={() => onToggle(path)}
        aria-expanded={open}
        aria-controls={`sidebar-group-${path.replaceAll(".", "-")}`}
        className="group flex w-full items-center gap-1 rounded-lg py-1.5 pr-2 text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
        style={{ paddingLeft: `${groupPad(level)}px` }}
      >
        <ChevronRight
          aria-hidden="true"
          className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${
            open ? "rotate-90 text-amber-500" : "text-muted-foreground/50"
          }`}
        />
        <span className="truncate">{label}</span>
      </button>
      <div
        id={`sidebar-group-${path.replaceAll(".", "-")}`}
        className={`grid transition-[grid-template-rows] duration-200 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <ul className="min-h-0 space-y-0.5 overflow-hidden">
          {items.map((item) =>
            isLeaf(item) ? (
              <li key={item.slug}>
                <NavLeafLink slug={item.slug} label={item.label} activeSlug={activeSlug} level={level + 1} />
              </li>
            ) : shouldFlatten(item as NavGroup) ? (
              <li key={"flat-" + (item as NavGroup).items[0].slug}>
                <NavLeafLink
                  slug={(item as NavGroup).items[0].slug}
                  label={(item as NavGroup).label}
                  activeSlug={activeSlug}
                  level={level + 1}
                />
              </li>
            ) : (
              <GroupSection
                key={"group-" + path + "." + items.indexOf(item)}
                label={(item as NavGroup).label}
                items={(item as NavGroup).items}
                path={path + "." + items.indexOf(item)}
                level={level + 1}
                openSet={openSet}
                onToggle={onToggle}
                activeSlug={activeSlug}
              />
            ),
          )}
        </ul>
      </div>
    </li>
  );
}

export default function CoursesSidebar({ courses }: CoursesSidebarProps) {
  const pathname = usePathname();
  const activeSlug = pathname.replace(/^\/courses\//, "");

  const activeCourse = courses.find((course) =>
    collectLeaves(course.items).some((leaf) => leaf.slug === activeSlug),
  );

  const activeGroupPath = activeCourse ? groupPathOf(activeCourse.items, activeSlug) : null;
  const ancestorPaths = new Set<string>();
  if (activeGroupPath) {
    const parts = activeGroupPath.split(".");
    for (let i = 1; i <= parts.length; i++) ancestorPaths.add(parts.slice(0, i).join("."));
  }

  const [openSet, setOpenSet] = useState<Set<string>>(ancestorPaths);

  const [prevSlug, setPrevSlug] = useState<string>(activeSlug);
  if (prevSlug !== activeSlug) {
    setPrevSlug(activeSlug);
    setOpenSet((prev) => new Set([...prev, ...ancestorPaths]));
  }

  if (!activeCourse) return null;

  const intro = collectLeaves(activeCourse.items)[0];

  const toggle = (path: string) => {
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  return (
    <nav className="text-sm" aria-label="Course navigation">
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
          {activeCourse.items.map((item, i) =>
            isLeaf(item) ? (
              <li key={item.slug}>
                <NavLeafLink slug={item.slug} label={item.label} activeSlug={activeSlug} level={1} />
              </li>
            ) : shouldFlatten(item as NavGroup) ? (
              <li key={"flat-" + (item as NavGroup).items[0].slug}>
                <NavLeafLink
                  slug={(item as NavGroup).items[0].slug}
                  label={(item as NavGroup).label}
                  activeSlug={activeSlug}
                  level={1}
                />
              </li>
            ) : (
              <GroupSection
                key={"group-" + i}
                label={(item as NavGroup).label}
                items={(item as NavGroup).items}
                path={`${i}`}
                level={1}
                openSet={openSet}
                onToggle={toggle}
                activeSlug={activeSlug}
              />
            ),
          )}
        </ul>
      </div>
    </nav>
  );
}