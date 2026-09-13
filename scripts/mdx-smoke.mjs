import { readFileSync } from "node:fs";
import { join } from "node:path";
import { compile } from "@mdx-js/mdx";
import { run } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import { Fragment, createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { visit } from "unist-util-visit";
import matter from "gray-matter";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import { toJs } from "estree-util-to-js";

const root = process.cwd();

function countBraceDelta(line) {
  let d = 0;
  for (const ch of line) {
    if (ch === "{" || ch === "[") d++;
    else if (ch === "}" || ch === "]") d--;
  }
  return d;
}

function makeStripImports(lessonDir) {
  const assets = {};
  return function stripImportsPlugin() {
    return function transformer(tree) {
      visit(tree, "mdxjsEsm", (node) => {
        console.log("ESM node pre:", JSON.stringify(node.value).slice(0, 120));
        const lines = String(node.value).split("\n");
        const out = [];
        let inTemplate = false;
        let inContinuation = false;
        let braceDepth = 0;

        for (const rawLine of lines) {
          const line = rawLine;
          const ticks = (line.match(/`/g) || []).length;
          if (ticks % 2 === 1) inTemplate = !inTemplate;

          if (inTemplate) {
            out.push(line);
            continue;
          }

          if (!inContinuation) {
            const m = /^\s*import\b/.exec(line);
            if (m) {
              const single = /^\s*import\s+([\w$]+)\s+from\s*["']([^"']+)["']\s*;?\s*$/.exec(line);
              braceDepth = countBraceDelta(line);
              const endsWithSemi = /;\s*$/.test(line);
              if (single) {
                const [, name, spec] = single;
                const url = resolveAsset(lessonDir, spec);
                if (url) {
                  assets[name] = url;
                  out.push(`const ${name} = ${JSON.stringify(url)};`);
                }
              } else if (braceDepth > 0) {
                inContinuation = true;
              }
              continue;
            }
            out.push(line);
          } else {
            braceDepth += countBraceDelta(line);
            if (braceDepth <= 0 && /;\s*$/.test(line)) {
              inContinuation = false;
            }
          }
        }

node.value = out.join("\n");
        node.data = {};
        console.log("ESM node post:", JSON.stringify(node.value).slice(0, 120));
    });
    };
  };
}

function resolveAsset(lessonDir, spec) {
  if (spec.startsWith("@/assets/")) {
    const p = join(root, "assets", spec.slice("@/assets/".length));
    return "/media/" + spec.slice("@/assets/".length);
  }
  if (spec.startsWith(".")) {
    const p = join(lessonDir, spec);
    const norm = p.replace(/\\/g, "/");
    const assetsIdx = norm.indexOf("/assets/");
    if (assetsIdx !== -1) return norm.slice(assetsIdx);
    return null;
  }
  return null;
}

const file = join(root, "content/docs/websocket/introduction/what-is-websocket.mdx");
const { content } = matter(readFileSync(file, "utf8"));

const stripImports = makeStripImports(join(root, "content/docs/websocket/introduction"));

function isImportCall(node) {
  if (!node) return null;
  let arg;
  if (node.type === "ImportExpression") arg = node.source;
  else if (node.type === "CallExpression" && node.callee && node.callee.type === "Import") arg = node.arguments[0];
  else return null;
  if (arg && arg.type === "CallExpression" && arg.callee && arg.callee.name === "_resolveDynamicMdxSpecifier") {
    arg = arg.arguments[0];
  }
  return arg && arg.type === "Literal" ? arg : null;
}

function patternNames(id) {
  if (!id) return [];
  if (id.type === "Identifier") return [id];
  if (id.type === "ObjectPattern") {
    return id.properties.flatMap((p) => (p.type === "Property" ? patternNames(p.value) : []));
  }
  if (id.type === "ArrayPattern") return [];
  return [];
}

function recmaResolveAssets(lessonDir) {
  return function recmaAssetPlugin() {
    return function transformer(tree, file) {
      const keep = (stmt, decl) => ({ ...stmt, declarations: [decl] });
      tree.body = tree.body.flatMap((stmt) => {
        if (stmt.type !== "VariableDeclaration") return [stmt];
        const out = [];
        for (const decl of stmt.declarations) {
          let src = null;
          if (decl.init && decl.init.type === "AwaitExpression") src = isImportCall(decl.init.argument);
          const spec = src ? String(src.value) : null;
          if (spec == null) {
            out.push(keep(stmt, decl));
            continue;
          }
          const url = resolveAsset(lessonDir, spec);
          if (!url) continue;
          for (const name of patternNames(decl.id)) {
            out.push({
              type: "VariableDeclaration",
              kind: "const",
              declarations: [
                {
                  type: "VariableDeclarator",
                  id: name,
                  init: { type: "Literal", value: url },
                },
              ],
            });
          }
        }
        return out;
      });

      // 2) Route JSX component identifiers through `_components` (they were
      //    left as bare identifiers because the compiler saw import bindings)
      walk(tree, (node, parent, key) => {
        if (
          node.type === "CallExpression" &&
          node.callee.type === "Identifier" &&
          ["_jsx", "_jsxs", "_jsxDEV", "jsx", "jsxs"].includes(node.callee.name) &&
          node.arguments[0] &&
          node.arguments[0].type === "Identifier" &&
          node.arguments[0].name !== "_Fragment"
        ) {
          node.arguments[0] = makeMember("_components", node.arguments[0].name);
        }
      });

      try {
        file.value = toJs(tree, {}).value;
      } catch (e) {
        console.log("TOJS ERROR:", e.message);
        throw e;
      }
      return undefined;
    };
  };
}

function makeMember(objectName, propertyName) {
  return {
    type: "MemberExpression",
    object: { type: "Identifier", name: objectName },
    property: { type: "Identifier", name: propertyName },
    computed: false,
    optional: false,
  };
}

function walk(node, visit, parent, key) {
  if (!node || typeof node.type !== "string") return;
  visit(node, parent, key);
  for (const k of Object.keys(node)) {
    if (k === "loc" || k === "range" || k === "start" || k === "end" || k === "comments" || k === "tokens") continue;
    const val = node[k];
    if (Array.isArray(val)) {
      for (const item of val) if (item && item.type) walk(item, visit, node, k);
    } else if (val && typeof val === "object" && val.type) {
      walk(val, visit, node, k);
    }
  }
}

const resolveAssets = recmaResolveAssets(join(root, "content/docs/websocket/introduction"));

const code = await compile(content, {
  outputFormat: "function-body",
  providerImportSource: "#",
  development: false,
  remarkPlugins: [remarkGfm],
  rehypePlugins: [rehypeSlug, [rehypePrettyCode, { theme: "github-dark", keepBackground: false }]],
  recmaPlugins: [resolveAssets],
});

const mod = await run(code, {
  ...runtime,
  Fragment,
  baseUrl: import.meta.url,
  useMDXComponents: () => ({}),
});
console.log("=== head of compiled body ===");
console.log(String(code.value).split("\n").slice(0, 12).join("\n"));

console.log("exports:", Object.keys(mod));

const Aside = ({ children }) => h("aside", { className: "aside" }, children);
const ContentImage = ({ src, alt }) => h("img", { src, alt });
const FlowDiagram = () => h("div", null, "FLOW");

const html = renderToStaticMarkup(
  mod.default({
    components: {
      Aside,
      ContentImage,
      FlowDiagram,
      img: (p) => h("img", p),
    },
  })
);

console.log("has biDirectional url:", html.includes("/media/websockets/bi-directional.png"));
console.log("renders img:", html.includes("<img"));
console.log("has aside:", html.includes('class="aside"'));
console.log("code tokens:", html.includes('data-rehype-pretty-code-figure'));
console.log("html length:", html.length);