const fs = require("node:fs");
const path = require("node:path");
const files = [];
function walk(d) { for (const e of fs.readdirSync(d, {withFileTypes:true})) { const p = path.join(d,e.name); if (e.isDirectory()) walk(p); else if (/\.(md|mdx)$/i.test(e.name)) files.push(p); } }
walk("content");
const flowPar = [], branch = [], parallel = [];
for (const f of files) {
  const s = fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n");
  const rel = path.relative("content", f).replace(/\\/g, "/");
  for (const m of s.matchAll(/<FlowDiagram\b/g)) flowPar.push(rel);
  for (const m of s.matchAll(/<BranchFlow\b/g)) branch.push(rel);
  for (const m of s.matchAll(/<ParallelFlow\b/g)) parallel.push(rel);
}
console.log("FlowDiagram: " + flowPar.length + "  BranchFlow: " + branch.length + "  ParallelFlow: " + parallel.length);