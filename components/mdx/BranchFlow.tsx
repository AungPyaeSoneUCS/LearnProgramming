export type BranchNodeType = "action" | "result";

export interface BranchNode {
  label: string;
  icon?: string;
  sublabel?: string;
}

export interface BranchFlowProps {
  condition: string;
  conditionIcon?: string;
  truePath?: BranchNode[];
  falsePath?: BranchNode[];
  trueLabel?: string;
  falseLabel?: string;
  caption?: string;
  source?: string;
}

export const BranchNodeIcon: Record<string, string> = {
  true: "✓",
  false: "✗",
  save: "💾",
  notify: "✉️",
  "right-arrow": "→",
  rocket: "🚀",
  alert: "⚠️",
};

export default function BranchFlow({
  condition,
  conditionIcon = "◇",
  truePath = [],
  falsePath = [],
  trueLabel = "TRUE",
  falseLabel = "FALSE",
  caption,
  source,
}: BranchFlowProps) {
  return (
    <div className="branch-wrap not-content my-6">
      {source && <div className="branch-input-row">{source}</div>}
      <div className="b-condition">
        <span className="diamond-icon" aria-hidden="true">
          {conditionIcon}
        </span>
        <span>{condition}</span>
      </div>
      <div className="fork-lines">
        <span className="fork-line fork-left" />
        <span className="fork-line fork-right" />
      </div>
      <div className="branch-body">
        <div className="path-col path-true">
          <span className="path-label-badge true-badge">{trueLabel}</span>
          <div className="path-arrow-down" aria-hidden="true" />
          <div className="path-nodes">
            {truePath.map((node, i) => (
              <div key={i} className="path-item">
                <div className="path-down-arrow" aria-hidden="true" />
                <div className="path-node b-node b-action">
                  <span className="b-icon">{BranchNodeIcon[node.icon ?? ""] ?? "→"}</span>
                  <span className="b-label">{node.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="path-col path-false">
          <span className="path-label-badge false-badge">{falseLabel}</span>
          <div className="path-arrow-down" aria-hidden="true" />
          <div className="path-nodes">
            {falsePath.map((node, i) => (
              <div key={i} className="path-item">
                <div className="path-down-arrow" aria-hidden="true" />
                <div className="path-node b-node b-action">
                  <span className="b-icon">{BranchNodeIcon[node.icon ?? ""] ?? "→"}</span>
                  <span className="b-label">{node.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {caption && <p className="branch-caption">{caption}</p>}
    </div>
  );
}
