export interface ParallelTarget {
  label: string;
  icon?: string;
  sublabel?: string;
  type?: "action" | "result";
}

export interface ParallelFlowProps {
  source: string;
  sourceIcon?: string;
  targets: ParallelTarget[];
  caption?: string;
  timeline?: string;
}

export default function ParallelFlow({
  source,
  sourceIcon = "⚡",
  targets,
  caption,
  timeline,
}: ParallelFlowProps) {
  return (
    <div className="parallel-wrap not-content my-6">
      <div className="src-row">
        <div className="p-node src-node">
          <span className="p-icon">{sourceIcon}</span>
          <span className="p-label">{source}</span>
        </div>
      </div>
      <div className="fan-section">
        <span className="fan-line-col">
          <span className="fan-vertical" />
          {targets.map((_, i) => (
            <span key={i} className="fan-tick" style={{ ["--fan-i" as string]: i }} />
          ))}
        </span>
        <span className="fan-horizontal-group">
          {targets.map((_, i) => (
            <span key={i} className="fan-horizontal" style={{ ["--fan-i" as string]: i }} />
          ))}
        </span>
      </div>
      <div className="targets-col">
        {targets.map((target, i) => (
          <div key={i} className="target-row">
            <span className="target-arrow" aria-hidden="true">
              ⤵
            </span>
            <div className={"p-node target-node" + (target.type === "result" ? " p-node-result" : "")}>
              <span className="p-icon">{target.icon ?? "→"}</span>
              <span className="p-label">{target.label}</span>
            </div>
          </div>
        ))}
      </div>
      {(caption || timeline) && (
        <p className="p-caption">
          {timeline && <span className="p-timeline">{timeline}</span>}
          {caption}
        </p>
      )}
    </div>
  );
}
