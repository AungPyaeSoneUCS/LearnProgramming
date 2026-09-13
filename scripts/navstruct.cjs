const fs = require("node:fs");
const nav = JSON.parse(fs.readFileSync("data/nav.json", "utf8"));
console.log("outer type:", Array.isArray(nav) ? "array len=" + nav.length : "object keys=" + Object.keys(nav).join(","));
const arr = Array.isArray(nav) ? nav : (nav.courses || nav.items || nav.groups || []);
console.log("courses:", arr.length);
for (const c of arr.slice(0, 12)) {
  const kids = c.items || c.children || [];
  console.log(`- ${c.label} [${kids.length}] slug=${c.slug || ""} type=${c.type || ""}`);
}
console.log("=== nav.json top keys (first course full) ===");
console.log(JSON.stringify(arr[0], null, 1).slice(0, 500));