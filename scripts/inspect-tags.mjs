const fs = require("fs");
const path = require("path");
const tags = ["FlowDiagram", "FlowChart", "BranchFlow", "BranchFlowDiagram", "ParallelFlow", "ParallelFlowDiagram", "ChapterFlow", "ThreadFlow", "ThreadDiagram", "BranchFlow", "ParallelFlow"];
const usages = {};
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".mdx")) {
      const s = fs.readFileSync(p, "utf8");
      for (const t of tags) {
        const re = new RegExp("<" + t + "\\b");
        if (re.test(s)) {
          (usages[t] ||= []).length < 2 && (usages[t] ||= []).push(path.relative("content", p).replace(/\\/g, "/"));
        }
      }
    }
  }
}
walk("content");
for (const t of Object.keys(usages)) console.log(t, "=>", usages[t].join(", "));
