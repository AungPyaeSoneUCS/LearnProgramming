import fs from "node:fs";
import path from "node:path";
const names = new Set();
const files = new Map(); // comp -> sample file
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".mdx")) {
      const s = fs.readFileSync(p, "utf8");
      for (const m of s.matchAll(/^import\s+([A-Za-z0-9_]+)\s*,\s*\{\s*([^}]+)\}\s*from/gm)) {
        const [_, def, rest] = m;
        if (def !== "defineConfig" && def !== "default") {
          names.add(def);
          files.set(def, path.relative("content", p).replace(/\\/g, "/"));
        }
        for (const nm of rest.split(",")) {
          const t = nm.trim().split(" as ")[0];
          if (t) { names.add(t); files.set(t, path.relative("content", p).replace(/\\/g, "/")); }
        }
      }
      for (const m of s.matchAll(/^import\s+([A-Za-z0-9_]+)\s+from/gm)) {
        const t = m[1];
        if (t !== "dotenv" ) { names.add(t); files.set(t, path.relative("content", p).replace(/\\/g, "/")); }
      }
    }
  }
}
walk("content");
const skip = new Set(["React","defineConfig","SLIDER_EXTERNAL","codes","SLIDER_INTERNAL"]);
for (const n of [...names].sort()) {
  if (skip.has(n)) continue;
  console.log(n + "  <-  " + (files.get(n) || "?"));
}