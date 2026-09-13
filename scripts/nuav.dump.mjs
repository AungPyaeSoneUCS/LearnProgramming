import fs from "node:fs";
const nav = JSON.parse(fs.readFileSync("data/nav.json", "utf8"));
const list = Array.isArray(nav) ? nav : nav.items ?? nav.nav ?? [];
function show(items, depth = 0) {
  for (const it of items) {
    if (!it) continue;
    const label = it.label || it.title || it.name || it.text || String(it.slug ?? "");
    const type = it.type && it.type !== "group" ? ":" + it.type : "";
    const has = Array.isArray(it.items) || Array.isArray(it.children) || Array.isArray(it.pages);
    console.log("  ".repeat(depth) + "- " + label + type + (has ? " [" + (it.items||it.children||it.pages)?.length + "]" : ""));
    const kids = it.items || it.children || it.pages;
    if (Array.isArray(kids) && kids.length && depth < 1 && kids[0] && typeof kids[0] === "object" && ("items" in kids[0] || "children" in kids[0] || "pages" in kids[0])) {
      show(kids.slice(0, 14), depth + 1);
    } else if (Array.isArray(kids) && depth < 1) {
      console.log("  ".repeat(depth+1) + "(leaf count: " + kids.length + ")");
    }
  }
}
console.log(JSON.stringify(Object.keys(nav)));
show(list, 0);
console.log("=== first item full ===");
console.log(JSON.stringify(list[0], null, 1).slice(0, 600));
