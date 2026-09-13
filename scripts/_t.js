const fs = require("node:fs");
const path = require("node:path");
const files = [];
(function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name); if(e.isDirectory()) walk(p); else if(/\.(md|mdx)$/i.test(e.name)) files.push(p);}}("content"));
const byTag = {};
for(const f of files){const s=fs.readFileSync(f,"utf8"); for(const m of s.matchAll(/<([A-Z][A-Za-z0-9_]*)\b/g)){const t=m[1]; (byTag[t] ??= []).push(path.relative("content",f).replace(/\\/g,"/"));}}
const lines = [];
for(const [tag, uses] of Object.entries(byTag).sort((a,b)=>b[1].length-a[1].length)) lines.push(`${tag}\t${uses.length}\t${[...new Set(uses)].slice(0,6).join(", ")}`);
fs.writeFileSync("scripts/_census.txt", lines.join("\n"), "utf8");
console.log("tags:", Object.keys(byTag).length);
