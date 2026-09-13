import fs from "node:fs";
import path from "node:path";
const seti = new Set(), icons = new Set(), quizShapes = [];
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.mdx$/i.test(e.name)) {
      const s = fs.readFileSync(p, "utf8").replace(/\r\n/g, "\n");
      for (const m of s.matchAll(/\bname=["']([^"']+)["']/g)) {
        const n = m[1].startsWith("seti:") ? seti : icons;
        n.add(m[1]);
      }
    }
  }
}
walk("content/docs");
console.log("== seti: icons =="); console.log([...seti].join("\n"));
console.log("== regular icon names =="); console.log([...icons].filter(x=>!x.startsWith("seti:")).sort().join(" "));
