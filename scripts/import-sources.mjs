import fs from "node:fs";
import path from "node:path";
const wanted = new Set(["Analytics","LessonCompletion","Quiz","CodePlayground","FlowDiagram","BranchFlow","ParallelFlow","ContentImage","Steps","Aside","Icon","Tabs","TabItem","LinkCard","CardGrid","Code","Image","Card"]);
const seen = new Set();
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(mdx|md)$/i.test(e.name)) {
      const s = fs.readFileSync(p, "utf8").replace(/\r\n/g, "\n");
      for (const line of s.split("\n")) {
        const m = line.match(/^import\s+(?:\*\s*as\s+)?([A-Za-z_$][\w$]*)?\s*,?\s*\{?\s*([^}]*?)\}?\s*from\s+["']([^"']+)["']/);
        if (!m) continue;
        const names = [m[1], ...(m[2]||"").split(",").map(x=>x.trim().split(/\s+as\s+/)[0])].filter(Boolean);
        for (const n of names) {
          if (wanted.has(n) && !seen.has(n)) {
            seen.add(n);
            console.log(n.padEnd(18) + " | " + m[3]);
          }
        }
      }
    }
  }
}
walk("content/docs");
