import fs from "node:fs";
import path from "node:path";
const names = new Set();
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(mdx|md)$/i.test(e.name)) {
      const s = fs.readFileSync(p, "utf8").replace(/\r\n/g, "\n");
      for (const m of s.matchAll(/^import\s+(?:\w+\s*,\s*)?\{([^}]*)\}\s+from/gm)) {
        for (const n of m[1].split(",")) {
          const t = n.trim().split(/\s+as\s+/)[0].trim();
          if (t && /^[A-Z]/.test(t)) names.add(t);
        }
      }
      for (const m of s.matchAll(/^import\s+([A-Z]\w*)\s+from/gm)) names.add(m[1]);
    }
  }
}
walk("content");
console.log([...names].sort().join("\n"));
