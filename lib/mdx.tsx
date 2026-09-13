import { Fragment } from "react";
import * as runtime from "react/jsx-runtime";
import { compile, run } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkMdx from "remark-mdx";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import { pathToFileURL } from "node:url";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import GitHubSlugger from "github-slugger";
import { readLessonSource, lessonDir } from "@/lib/lessons";

export type MDXContentValue = (props?: { components?: Record<string, unknown> }) => React.ReactNode;

export interface TocItem {
  id: string;
  text: string;
  depth: number;
}

export interface CompiledLesson {
  MDXContent: MDXContentValue;
  exports: Record<string, unknown>;
  toc: TocItem[];
  title: string;
  description?: string;
}

/* ------------------------------------------------------------------ */
/* recma: resolve asset imports to /media URLs, drop component imports, */
/* and route imported JSX components through `_components`.            */
/* ------------------------------------------------------------------ */

function resolveAsset(lessonDirPath: string, spec: string): string | null {
  if (spec.startsWith("@/assets/")) {
    return "/media/" + spec.slice("@/assets/".length);
  }
  if (spec.startsWith(".")) {
    const norm = (lessonDirPath + "/" + spec).replace(/\\/g, "/");
    const assetsIdx = norm.indexOf("/assets/");
    if (assetsIdx !== -1) {
      const url = norm.slice(assetsIdx + "/assets/".length + 1);
      return "/media/" + url;
    }
    return null;
  }
  return null;
}

function isImportCall(node: unknown): { type: "Literal"; value: string } | null {
  if (!node || typeof node !== "object") return null;
  const n = node as { type?: string; source?: unknown; callee?: { type?: string; name?: string }; arguments?: unknown[] };
  let arg: unknown;
  if (n.type === "ImportExpression") arg = n.source;
  else if (n.type === "CallExpression" && n.callee?.type === "Import") arg = n.arguments?.[0];
  else return null;
  if (
    arg &&
    typeof arg === "object" &&
    (arg as { type?: string }).type === "CallExpression" &&
    (arg as { callee?: { name?: string } }).callee?.name === "_resolveDynamicMdxSpecifier"
  ) {
    arg = (arg as { arguments?: unknown[] }).arguments?.[0];
  }
  const asLit = arg as { type?: string; value?: unknown };
  return asLit && asLit.type === "Literal" && typeof asLit.value === "string" ? { type: "Literal", value: asLit.value } : null;
}

function patternNames(id: unknown): unknown[] {
  if (!id || typeof id !== "object") return [];
  const n = id as { type?: string };
  if (n.type === "Identifier") return [id];
  if (n.type === "ObjectPattern") {
    const props = (id as { properties?: unknown[] }).properties ?? [];
    return props.flatMap((p) => (p && typeof p === "object" && (p as { type?: string }).type === "Property" ? patternNames((p as { value?: unknown }).value) : []));
  }
  return [];
}

function styleStringToObject(css: string) {
  const properties: unknown[] = [];
  for (const declaration of css.split(";")) {
    const index = declaration.indexOf(":");
    if (index === -1) continue;
    const prop = declaration.slice(0, index).trim();
    const value = declaration.slice(index + 1).trim();
    if (!prop || !value) continue;
    const key = prop.replace(/-([a-z])/g, (_, char: string) => char.toUpperCase());
    properties.push({
      type: "Property",
      key: { type: "Identifier", name: key },
      value: { type: "Literal", value },
      computed: false,
      shorthand: false,
      method: false,
      kind: "init",
    });
  }
  return { type: "ObjectExpression", properties };
}

function makeMember(objectName: string, propertyName: string) {
  return {
    type: "MemberExpression",
    object: { type: "Identifier", name: objectName },
    property: { type: "Identifier", name: propertyName },
    computed: false,
    optional: false,
  };
}

function walk(node: unknown, visitFn: (n: unknown) => void): void {
  if (!node || typeof node !== "object") return;
  const n = node as { type?: string };
  if (typeof n.type !== "string") return;
  visitFn(node);
  if (Array.isArray(node)) return;
  for (const k of Object.keys(n)) {
    if (k === "loc" || k === "range" || k === "start" || k === "end" || k === "comments" || k === "tokens") continue;
    const val = (n as Record<string, unknown>)[k];
    if (Array.isArray(val)) {
      for (const item of val) if (item && typeof item === "object") walk(item, visitFn);
    } else if (val && typeof val === "object" && (val as { type?: string }).type) {
      walk(val, visitFn);
    }
  }
}

interface RecmaOptions {
  dir?: string;
}

function recmaResolveAssets(options?: RecmaOptions) {
  const lessonDirPath = options?.dir ?? process.cwd();
  return function transformer(tree: { body?: unknown[] }): undefined {
      const keep = (stmt: unknown, decl: unknown) => ({ ...(stmt as object), declarations: [decl] });
      tree.body = (tree.body ?? []).flatMap((stmt) => {
        const s = stmt as { type?: string; declarations?: unknown[] };
        if (s.type !== "VariableDeclaration") return [stmt];
        const out: unknown[] = [];
        for (const decl of s.declarations ?? []) {
          const d = decl as { init?: unknown; id?: unknown };
          let src = null;
          if (d.init && typeof d.init === "object" && (d.init as { type?: string }).type === "AwaitExpression") {
            src = isImportCall((d.init as { argument?: unknown }).argument);
          }
          const spec = src ? String(src.value) : null;
          if (spec == null) {
            out.push(keep(stmt, decl));
            continue;
          }
          const url = resolveAsset(lessonDirPath, spec);
          if (!url) continue;
          for (const name of patternNames(d.id)) {
            out.push({
              type: "VariableDeclaration",
              kind: "const",
              declarations: [{ type: "VariableDeclarator", id: name, init: { type: "Literal", value: url } }],
            });
          }
        }
        return out;
      });

      walk(tree, (node) => {
        const n = node as {
          type?: string;
          callee?: { type?: string; name?: string };
          arguments?: unknown[];
          key?: { type?: string; name?: string };
          value?: { type?: string; value?: unknown };
        };
        if (
          n.type === "Property" &&
          n.key?.type === "Identifier" &&
          n.key.name === "style" &&
          n.value?.type === "Literal" &&
          typeof n.value.value === "string"
        ) {
          n.value = styleStringToObject(n.value.value) as { type?: string; value?: unknown };
          return;
        }
        if (
          n.type === "CallExpression" &&
          n.callee?.type === "Identifier" &&
          ["_jsx", "_jsxs", "_jsxDEV", "jsx", "jsxs"].includes(n.callee.name ?? "") &&
          n.arguments?.[0] &&
          typeof n.arguments[0] === "object" &&
          (n.arguments[0] as { type?: string }).type === "Identifier" &&
          (n.arguments[0] as { name?: string }).name !== "_Fragment"
        ) {
          n.arguments[0] = makeMember("_components", (n.arguments[0] as { name?: string }).name!);
        }
      });
    return undefined;
  };
}

/* ------------------------------------------------------------------ */
/* TOC extraction                                                      */
/* ------------------------------------------------------------------ */

function mdastText(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  const n = node as { type?: string; value?: string; children?: unknown[] };
  if (n.type === "text" || n.type === "inlineCode") return String(n.value ?? "");
  if (n.children) return n.children.map(mdastText).join("");
  return "";
}

function extractToc(content: string): TocItem[] {
  const tree = unified().use(remarkParse).use(remarkMdx).parse(content);
  const slugs = new GitHubSlugger();
  const toc: TocItem[] = [];
  visit(tree, (node) => {
    if (!node || typeof node !== "object") return;
    const n = node as { type?: string; depth?: number };
    if (n.type === "heading" && n.depth && n.depth >= 2 && n.depth <= 4) {
      const text = mdastText(node).trim();
      if (!text) return;
      toc.push({ id: slugs.slug(text), text, depth: n.depth });
    }
  });
  return toc;
}

/* ------------------------------------------------------------------ */
/* Compilation                                                         */
/* ------------------------------------------------------------------ */

export async function renderLesson(slug: string): Promise<CompiledLesson | null> {
  const lesson = readLessonSource(slug);
  if (!lesson) return null;

  const code = await compile(lesson.content, {
    outputFormat: "function-body",
    providerImportSource: "#",
    development: false,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: "github-dark",
          keepBackground: false,
        },
      ] as [typeof rehypePrettyCode, Record<string, unknown>],
    ],
    recmaPlugins: [[recmaResolveAssets, { dir: lessonDir(lesson.filePath) }]],
  });

  const dirForBaseUrl = lessonDir(lesson.filePath).replace(/\\/g, "/");
  const mod = (await run(code, {
    ...runtime,
    Fragment,
    baseUrl: pathToFileURL(dirForBaseUrl + "/").href,
    useMDXComponents: () => ({}),
  })) as { default: MDXContentValue } & Record<string, unknown>;
  const { default: MDXContent, ...exports } = mod;

  return {
    MDXContent,
    exports,
    toc: extractToc(lesson.content),
    title: (lesson.data.title as string) ?? "",
    description: lesson.data.description as string | undefined,
  };
}

export { mdxComponents } from "@/components/mdx";