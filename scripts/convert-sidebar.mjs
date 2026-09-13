import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Extract the balanced `sidebar: [...]` array literal from astro.config.mjs
 * and convert it to JSON. The literal only contains `label`, `items` and `slug`
 * keys, so it can be safely evaluated as a pure JS expression.
 */
const src = readFileSync(join(root, "..", "takkatho", "astro.config.mjs"), "utf8");

const marker = "sidebar: [";
const start = src.indexOf(marker);
if (start === -1) {
  throw new Error("sidebar: [ not found in astro.config.mjs");
}

let i = start + marker.length - 1; // index of the opening '['
let depth = 0;
let inString = false;
let quote = "";
let buf = "";

// Manual scan from the opening bracket with string awareness.
let scanStart = start + marker.length - 1;
for (let j = scanStart; j < src.length; j++) {
  const ch = src[j];
  if (inString) {
    buf += ch;
    if (ch === "\\") {
      buf += src[j + 1];
      j++;
      continue;
    }
    if (ch === quote) inString = false;
    continue;
  }
  if (ch === '"' || ch === "'") {
    inString = true;
    quote = ch;
    buf += ch;
    continue;
  }
  if (ch === "[") depth++;
  if (ch === "]") depth--;
  buf += ch;
  if (depth === 0) break;
}

const literal = buf.trim().replace(/,\s*\]$/, "]");
const sidebar = new Function(`return (${literal});`)();
i = 0; // silence unused var lint

mkdirSync(join(root, "data"), { recursive: true });
writeFileSync(join(root, "data", "sidebar.json"), JSON.stringify(sidebar, null, 2), "utf8");
console.log(`Wrote data/sidebar.json with ${sidebar.length} top-level course entries`);