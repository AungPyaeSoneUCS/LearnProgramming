import { codeToHtml } from "shiki";

export interface CodeProps {
  code?: string;
  lang?: string;
  title?: string;
}

const langMap: Record<string, string> = {
  js: "javascript",
  jsx: "javascript",
  ts: "typescript",
  tsx: "typescript",
  typescript: "typescript",
  python: "python",
  py: "python",
  sh: "bash",
  shell: "bash",
  zsh: "bash",
  yml: "yaml",
  yaml: "yaml",
  json: "json",
  html: "html",
  css: "css",
  md: "markdown",
  markdown: "markdown",
  go: "go",
  sql: "sql",
  text: "text",
};

/**
 * Code — server component rendering a syntax-highlighted block via shiki,
 * styled to match rehype-pretty-code output (data-rehype-pretty-code-figure).
 */
export default async function Code({ code = "", lang, title }: CodeProps) {
  const language = langMap[(lang ?? "").toLowerCase()] ?? "text";
  const html = await codeToHtml(code, {
    lang: language as Parameters<typeof codeToHtml>[1]["lang"],
    themes: {
      light: "github-light",
      dark: "github-dark",
    },
    defaultColor: false,
  });

  return (
    <figure className="my-6 overflow-hidden rounded-xl border border-border" data-rehype-pretty-code-figure>
      {title && (
        <figcaption
          className={`border-b border-border bg-muted px-4 py-2 text-xs font-semibold text-muted-foreground ${
            language === "bash" ? 'before:content-["❯"] before:mr-2 before:text-primary' : ""
          }`}
        >
          {title}
        </figcaption>
      )}
      <div
        className="overflow-x-auto text-[0.82rem] leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </figure>
  );
}
