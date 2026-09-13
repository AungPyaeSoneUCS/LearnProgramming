import fs from "node:fs";
import path from "node:path";
const tags = ["FlowDiagram","BranchFlow","ParallelFlow","BranchFlowDiagram","ParallelFlowDiagram","Quiz","CodePlayground","LessonCompletion","Tabs","TabItem","Steps","Aside","Icon","ContentImage"];
const out = {};
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".mdx")) {
      const s = fs.readFileSync(p, "utf8").replace(/\r\n/g, "\n");
      for (const t of tags) {
        const re = new RegExp("<(?:Tar)?(?:abItem)?\\b","g"); // noop
        if (s.includes(">" + t) || s.includes(" " + t) ) {}
      }
      for (const m of s.matchAll(/<([A-Z][A-Za-z0-9]*)\b/g)) {
        const t = m[1];
        if (tags.includes(t)) (out[t] = out[t] || []).length < 2 && out[t].push(path.relative("content", p).replace(/\\/g, "/"));
      }
    }
  }
}
walk("content");
for (const t of Object.keys(out)) console.log(t + " (" + (counts[t]||"?" ) + ") → " + out[t].join(", "));
