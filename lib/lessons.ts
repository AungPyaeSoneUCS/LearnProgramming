import { existsSync, readFileSync } from "node:fs";
import { join, sep } from "node:path";
import matter from "gray-matter";
import navTree from "@/data/nav.json";

export const contentRoot = join(process.cwd(), "content", "docs");

export type NavLeaf = { label: string; slug: string };
export type NavGroup = { label: string; items: NavLeaf[] };
export type NavCourse = { label: string; slug?: string; items: (NavGroup | NavLeaf)[] };

export interface Frontmatter {
  title?: string;
  description?: string;
  template?: string;
  sidebar?: string;
  [key: string]: unknown;
}

export interface LessonMeta {
  slug: string;
  label: string;
  courseLabel: string;
  data: Frontmatter;
}

export function getNavCourses(): NavCourse[] {
  return navTree as NavCourse[];
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

export function getAllLeafSlugs(): string[] {
  return getNavCourses().flatMap((c) => collectLeaves(c.items).map((l) => l.slug));
}

export function resolveLessonFile(slug: string): string | null {
  const direct = join(contentRoot, ...slug.split("/")) + ".mdx";
  if (existsSync(direct)) return direct;
  const index = join(contentRoot, ...slug.split("/"), "index.mdx");
  if (existsSync(index)) return index;
  const nested = join(contentRoot, ...slug.split("/"), slug.split("/").at(-1)!) + ".mdx";
  if (existsSync(nested)) return nested;
  return null;
}

export function lessonDir(filePath: string): string {
  return filePath.slice(0, Math.max(filePath.lastIndexOf("/"), filePath.lastIndexOf("\\")));
}

export function readLessonSource(slug: string): { filePath: string; content: string; data: Frontmatter } | null {
  const filePath = resolveLessonFile(slug);
  if (!filePath) return null;
  const raw = readFileSync(/* turbopackIgnore: true */ filePath, "utf8");
  const parsed = matter(raw);
  return { filePath, content: parsed.content, data: parsed.data as Frontmatter };
}

export interface NavigationSibling {
  prev?: { label: string; slug: string };
  next?: { label: string; slug: string };
}

export function getSiblings(slug: string): NavigationSibling {
  const courses = getNavCourses();
  for (const course of courses) {
    const leaves = collectLeaves(course.items);
    const idx = leaves.findIndex((l) => l.slug === slug);
    if (idx !== -1) {
      return {
        prev: idx > 0 ? leaves[idx - 1] : undefined,
        next: idx < leaves.length - 1 ? leaves[idx + 1] : undefined,
      };
    }
  }
  return {};
}

export function courseOf(slug: string): string {
  return slug.split("/")[0];
}

export function courseInfo(slug: string): { label: string; introSlug: string } | null {
  const first = slug.split("/")[0];
  for (const course of getNavCourses()) {
    const leaves = collectLeaves(course.items);
    if (!leaves.length) continue;
    const belongs =
      leaves.some((l) => l.slug === slug) ||
      leaves.some((l) => l.slug === first) ||
      leaves.some((l) => l.slug.startsWith(first + "/"));
    if (belongs) return { label: course.label, introSlug: leaves[0].slug };
  }
  return null;
}

export function courseIntroSlug(course: NavCourse): string | null {
  const leaves = collectLeaves(course.items);
  return leaves[0]?.slug ?? null;
}

export function courseLessonCount(course: NavCourse): number {
  return collectLeaves(course.items).length;
}

export function toUrl(slug: string): string {
  return "/courses/" + slug.split("/").map(encodeURIComponent).join("/");
}

export const filesystemSep = sep;