import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const nav = JSON.parse(readFileSync("data/nav.json", "utf8"));
const slugs = new Set();
for (const c of nav) {
  const walk = (nodes) => nodes.forEach((n) => {
    if (typeof n.slug === "string") slugs.add(n.slug);
    else if (n.items) walk(n.items);
  });
  walk(c.items);
}
const valid = (u) => {
  if (!u.startsWith("/courses/")) return false;
  const rel = u.replace("/courses/", "");
  return slugs.has(rel) || true;
};

const files = readdirSync("content/docs/css3", { recursive: true })
  .filter((f) => typeof f === "string" && f.endsWith(".mdx"));
const linkRe = /\[[^\]]*\]\(([^)]+)\)|href="([^"]+)"/g;
const bad = [];
for (const f of files) {
  const t = readFileSync(join("content/docs/css3", f), "utf8");
  let m;
  while ((m = linkRe.exec(t))) {
    const u = (m[1] || m[2]);
    if (!u || /^(http|#|mailto:|tel:|\/)/.test(u)) continue;
    bad.push(`${f} => ${u}`);
  }
}
// Also flag /courses/ links that point to a non-existent slug pattern (exact match missing is ok for index links, but check prefix)
const courseLinks = [];
for (const f of files) {
  const t = readFileSync(join("content/docs/css3", f), "utf8");
  let m;
  while ((m = /\(\/(courses\/[^)"]+|css3\/[^)"]+)\)/g.exec(t))) {
    courseLinks.push(`${f} => ${m[1]}`);
  }
}
console.log("possible broken (non-/courses) links:");
console.log(bad.length ? bad.join("\n") : "none");
console.log("course-looking links found in CSS3 content:");
console.log(courseLinks.length ? courseLinks.join("\n") : "none");