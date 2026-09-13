import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync, statSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const docsDir = join(root, "content", "docs");
const assetsDir = join(root, "assets");
const mediaDir = join(root, "public", "media");
const sidebarFile = join(root, "data", "sidebar.json");

// 1) Copy every asset under assets/ -> public/media/ preserving structure
if (existsSync(mediaDir)) rmSync(mediaDir, { recursive: true, force: true });
if (existsSync(assetsDir)) {
  mkdirSync(mediaDir, { recursive: true });
  cpSync(assetsDir, mediaDir, { recursive: true, force: true });
  console.log(`✓ Copied assets -> public/media`);
}

// 2) Validate sidebar slugs against filesystem
const sidebar = JSON.parse(readFileSync(sidebarFile, "utf8"));
const slugs = [];
(function walk(items) {
  for (const it of items) {
    if (it.slug) slugs.push(it.slug);
    if (it.items) walk(it.items);
  }
})(sidebar);

const missing = [];
for (const s of slugs) {
  const f = resolveLessonFile(s);
  if (!f) missing.push(s);
}

const files = [];
(function collect(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) collect(p);
    else if (e.endsWith(".mdx")) files.push(p);
  }
})(docsDir);

const fileSlugs = new Set(files.map((f) => f.slice(docsDir.length + 1, -4).replace(/\\/g, "/")));
const notInSidebar = [...fileSlugs].filter((s) => s && s !== "index" && !slugs.includes(s));

console.log(`✓ sidebar slugs: ${slugs.length}, mdx files: ${files.length}`);
if (missing.length) console.log(`⚠ missing files for sidebar slugs: ${missing.length}`, missing);
if (notInSidebar.length) console.log(`⚠ files not in sidebar: ${notInSidebar.length}`, notInSidebar);

// 3) Generate lightweight search index
function resolveLessonFile(slug) {
  const direct = join(docsDir, `${slug}.mdx`);
  if (existsSync(direct)) return direct;
  const index = join(docsDir, slug, "index.mdx");
  if (existsSync(index)) return index;
  return null;
}

// 2b) Build augmented navigation tree: sidebar.json + any lesson files not
// covered by the config sidebar (advanced-css course, extra n8n + database
// lessons). Persists to data/nav.json.
function getTitleFromFile(file) {
  if (!file) return "";
  const raw = readFileSync(file, "utf8");
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw);
  if (m) {
    const tm = /^\s*title:\s*["']?([^"'\n]+)/m.exec(m[1]);
    if (tm) return tm[1].trim();
  }
  return "";
}
function prettifyLabel(s) {
  return s
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
    .replace(/\b(Css|Html)(?=\d)/gi, (m) => m.toUpperCase())
    .replace(/\b(Css|Sql|Js)\b/gi, (m) => m.toUpperCase());
}

const nav = JSON.parse(JSON.stringify(sidebar)); // deep copy

function flattenLeaves(items, target) {
  for (const it of items) {
    if (it.slug) target.add(it.slug);
    if (it.items) flattenLeaves(it.items, target);
  }
}
const covered = new Set();
flattenLeaves(nav, covered);

// map course-root -> containing top-level group (mutation of leaf list)
const rootToGroup = new Map();
function mapGroups(items, group) {
  for (const it of items) {
    if (it.slug) {
      const root = it.slug.split("/")[0];
      if (!rootToGroup.has(root)) rootToGroup.set(root, group);
    } else if (it.items) {
      mapGroups(it.items, group || it);
    }
  }
}
mapGroups(nav, null);
// top-level groups themselves map to their root when identifiable
for (const g of nav) {
  const firstLeaf = (function find(items) {
    for (const it of items) {
      if (it.slug) return it.slug;
      if (it.items) {
        const r = find(it.items);
        if (r) return r;
      }
    }
    return null;
  })(g.items);
  if (firstLeaf) {
    const root = firstLeaf.split("/")[0];
    if (!rootToGroup.has(root)) rootToGroup.set(root, g);
  }
}

const uncovered = [];
for (const f of files) {
  const slug = f.slice(docsDir.length + 1, -4).replace(/\\/g, "/");
  if (slug === "index") continue;
  if (covered.has(slug)) continue;
  if (existsSync(join(docsDir, slug, "index.mdx"))) continue; // course landing handled by slug
  uncovered.push(slug);
}
uncovered.sort();

const newRootGroups = [];
for (const slug of uncovered) {
  const root = slug.split("/")[0];
  let group = rootToGroup.get(root);
  if (!group) {
    const existing = newRootGroups.find((g) => g.root === root);
    if (existing) {
      group = existing.group;
    } else {
      group = {
        root,
        group: { label: prettifyLabel(root), items: [] },
      };
      newRootGroups.push(group);
    }
  }
  const parentItems = group.items || group.group.items;
  const title = getTitleFromFile(join(docsDir, `${slug}.mdx`));
  parentItems.push({ label: title || prettifyLabel(slug.split("/").pop()), slug });
}
for (const g of newRootGroups) nav.push(g.group);

writeFileSync(join(root, "data", "nav.json"), JSON.stringify(nav, null, 2), "utf8");
console.log(`✓ data/nav.json (${nav.length} courses, ${uncovered.length} files auto-added)`);

function stripFrontmatter(src) {
  if (!src.startsWith("---")) return src;
  const end = src.indexOf("\n---", 3);
  return end === -1 ? src : `\n${src.slice(end + 4)}`;
}
function stripBlocks(src) {
  return src
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_\-\[\]()!]/g, " ");
}

const index = [];
for (const s of slugs) {
  const f = join(docsDir, `${s}.mdx`);
  if (!existsSync(f)) continue;
  const raw = readFileSync(f, "utf8");
  let title = s.split("/").pop() || "";
  let body = raw;
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw);
  if (m) {
    const fm = m[1];
    const titleMatch = /^\s*title:\s*["']?([^"'\n]+)/m.exec(fm);
    if (titleMatch) title = titleMatch[1].trim();
    body = raw.slice(m[0].length);
  }
  const content = stripBlocks(stripFrontmatter(body)).replace(/\s+/g, " ").slice(0, 1200);
  index.push({ slug: s, title, content });
}
mkdirSync(join(root, "public"), { recursive: true });
writeFileSync(join(root, "public", "search-index.json"), JSON.stringify(index), "utf8");
console.log(`✓ search-index.json (${index.length} entries)`);