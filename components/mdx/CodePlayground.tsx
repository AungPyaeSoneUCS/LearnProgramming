"use client";

import PlaygroundCode from "./PlaygroundCode";

export interface CodePlaygroundProps {
  initialHtml?: string;
  initialCss?: string;
  initialJs?: string;
  title?: string;
}

export default function CodePlayground({
  initialHtml = `<h1>Hello Myanmar!</h1>`,
  initialCss = `h1 { color: teal; }`,
  initialJs = ``,
  title = "Code Playground",
}: CodePlaygroundProps) {
  return (
    <section className="not-content my-8 overflow-hidden rounded-2xl border border-border">
      <div className="flex items-center justify-between border-b border-border bg-muted/60 px-4 py-2.5">
        <span className="text-sm font-semibold text-foreground">{title}</span>
        <button
          onClick={() => {
            const frame = document.getElementById("pgframe") as HTMLIFrameElement | null;
            frame?.contentWindow?.postMessage({ event: "reload" }, "*");
          }}
          className="btn btn-outline btn-sm rounded-md"
        >
          ▶ Run
        </button>
      </div>
      <div className="grid grid-cols-1 gap-px bg-border md:grid-cols-3">
        <div className="min-w-0 bg-card p-3">
          <PlaygroundCode code={initialHtml} title="HTML" />
        </div>
        <div className="min-w-0 bg-card p-3">
          <PlaygroundCode code={initialCss} title="CSS" />
        </div>
        <div className="min-w-0 bg-card p-3">
          <PlaygroundCode code={initialJs} title="JavaScript" />
        </div>
      </div>
      <div className="h-64 bg-white p-2">
        <iframe
          id="pgframe"
          title="Playground output"
          className="h-full w-full bg-white"
          sandbox="allow-scripts"
        />
      </div>
    </section>
  );
}
