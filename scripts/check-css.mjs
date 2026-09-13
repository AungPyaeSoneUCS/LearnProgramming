import fs from "node:fs";
const css = fs.readFileSync("app/globals.css", "utf8");
const wanted = [
  "flow-wrap","flow-row","flow-node","node-icon","node-body","node-label","node-sub",
  "flow-arrow-wrap","arrow-label","arrow-svg","flow-caption","branch-wrap","branch-row",
  "b-node","b-action","b-icon","b-label","b-condition","b-arrow","branch-arrow",
  "diamond-icon","fork-lines","fork-line","fork-left","fork-right","branch-body",
  "condition-col","paths-row","path-col","path-icon","true-badge","false-badge",
  "path-arrow-down","path-items","path-item","path-down","path-node","true-node","false-node",
  "parallel-wrap","src-row","p-node","p-icon","p-label","fan-section","fan-line-col",
  "fan-vertical","fan-h","targets-col","target-row","target-arrow","target-node","p-caption"
];
const missing = [];
for (const w of wanted) {
  const re = new RegExp("\\." + w + "\\b");
  if (!re.test(css)) missing.push(w);
}
console.log(missing.length ? "MISSING: " + missing.join(", ") : "all selectors present");
