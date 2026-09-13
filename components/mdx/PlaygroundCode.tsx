export interface PlaygroundCodeProps {
  code?: string;
  title?: string;
}

export default function PlaygroundCode({ code = "", title }: PlaygroundCodeProps) {
  return (
    <figure className="overflow-hidden rounded-xl border border-border" data-rehype-pretty-code-figure>
      {title && (
        <figcaption className="border-b border-border bg-muted px-4 py-2 text-xs font-semibold text-muted-foreground">
          {title}
        </figcaption>
      )}
      <div className="overflow-x-auto text-[0.82rem] leading-relaxed">
        <pre className="p-3 font-mono">
          <code>{code}</code>
        </pre>
      </div>
    </figure>
  );
}