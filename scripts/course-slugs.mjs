const fs = require("node:fs");
const nav = JSON.parse(fs.readFileSync("data/nav.json", "utf8"));
const seen = new Set();
function walk(items, depth) {
  for (const it of items) {
    if (!it || typeof it !== "object") continue;
    if (typeof it.slug === "string") {
      const slug = it.slug.split("/")[0];
      if (!seen.has(slug)) { seen.add(slug); console.log("COURSE slug:", slug, " label:", it.label); }
    }
    const kids = it.items || it.children;
    if (Array.isArray(kids)) walk(kids, (depth||0)+1);
  }
}
walk(nav, 0);
console.log("total top-level courses:", nav.length);