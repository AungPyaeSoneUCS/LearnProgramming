import fs from "node:fs";
import path from "node:path";
const tags = ["Quiz","CodePlayground","LessonCompletion"];
for (const t of tags) {
  console.log("======== " + t + " ========");
  let n = 0;
  function walk(d) { for (const e of fs.readdirSync(d,{withFileTypes:true})) { const p=path.join(d,e.name); if(e.isDirectory()) walk(p); else if(/\.(mdx)$/i.test(e.name)) { const s=fs.readFileSync(p,"utf8"); for (const m of s.matchAll(new RegExp("<"+t+"\\b[^>]*?>","g"))) { const frag=m[0].replace(/\s+/g," ").trim(); const one=(frag.length>500)?frag.slice(0,500)+"…":frag; if(n<4){console.log("  "+path.relative("content",p).replace(/\\/g,"/")+" :: "+one); n++;} } } } }
  walk("content");
  if(!n) console.log("  (no direct <Tag> usage found)");
}
