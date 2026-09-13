const fs = require("node:fs");
const path = require("node:path");
const tags = {
  FlowDiagram: "flow", FlowChart: "chart", BranchFlow: "branch", BranchFlowDiagram: "branch",
  ParallelFlow: "parallel", ParallelFlowDiagram: "parallel", ChapterFlow: "thread", ThreadFlow: "thread",
};
const usages = {};
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".mdx")) {
      const s = fs.readFileSync(p, "utf8");
      for (const [tag, kind] of Object.entries(tags)) {
        if (s.includes("<" + tag) && !s.includes("import " + tag)) {
          (usages[kind] = usages[kind] || []).push(tag + " :: " + path.relative("content", p));
        }
      }
    }
  }
}
walk("content");
for (const [k, v] of Object.entries(usages)) {
  console.log("==" + k.toUpperCase() + "==");
  v.slice(0, 6).forEach((x) => console.log("  " + x));
}
