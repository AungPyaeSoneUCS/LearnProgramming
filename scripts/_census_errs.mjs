const fs = require("node:fs");
const log = fs.readFileSync("scripts/_build.log", "utf8");
const errs = log.split(/\r?\n/).filter((l) => l.includes("error TS"));
fs.writeFileSync("scripts/_census_errs.txt", errs.join("\n"), "utf8");
console.log("errors=" + errs.length);
