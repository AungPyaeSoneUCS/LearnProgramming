import fs from "node:fs";
import path from "node:path";
const tags = ["FlowDiagram","FlowChart","FlowData","BranchFlow","BranchFlowDiagram","ParallelFlow","ParallelFlowDiagram","FlowBranch","BranchDiagram"];
const usages = {};
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".mdx")) {
      const s = fs.readFileSync(p, "utf8");
      for (const t of tags) {
        if (new RegExp("<" + t + "\\b").test(s)) {
          (usages[t] = usages[t] || []).push(path.relative("content", p).replace(/\\/g, "/"));
        }
      }
    }
  }
}
walk("content");
for (const t of Object.keys(usages)) {
  console.log("==" + t + "==");
  usages[t].slice(0, 5).forEach((x) => console.log("  " + x));
}
