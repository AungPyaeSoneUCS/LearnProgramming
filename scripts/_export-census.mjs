import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

function lines(file) {
  try {
    return fs.readFileSync(path.join(ROOT, file), "utf8").split(/\r?\n/);
  } catch (e) {
    return ["<MISSING " + file + ">"];
  }
}

function exportsOf(file) {
  const out = [];
  for (const l of lines(file)) {
    const m = l.match(/^\s*export\s+(?:type\s+)?(?:async\s+)?(function|const|class|interface|type)\s+([A-Za-z_$][\w$]*)/);
    if (m) out.push(m[1] + " " + m[2]);
    const m2 = l.match(/^\s*export\s*\{([^}]*)\}/);
    if (m2) out.push("{}: " + m2[1].replace(/\s+/g, " ").trim());
  }
  return out;
}

console.log("== lib/mdx.ts ==");
exportsOf("lib/mdx.ts").forEach((x) => console.log("  " + x));
console.log("== lib/mdx.tsx ==");
exportsOf("lib/mdx.tsx").forEach((x) => console.log("  " + x));
console.log("== lib/nav.ts ==");
exportsOf("lib/nav.ts").forEach((x) => console.log("  " + x));
console.log("== lib/lessons.ts ==");
exportsOf("lib/lessons.ts").forEach((x) => console.log("  " + x));

console.log("== import graph (who imports lib/mdx) ==");
for (const f of ["app/page.tsx", "app/courses/[course]/[slug]/page.tsx", "app/layout.tsx"].filter((x) => fs.existsSync(path.join(ROOT, x)))) {
  console.log("  -- " + f);
  lines(f).filter((l) => l.includes("from ") || l.includes("import(")).forEach((l) => console.log("     " + l.trim()));
}
