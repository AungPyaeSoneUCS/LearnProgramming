import { Fragment } from "react";

export type FlowNodeType = "trigger" | "action" | "code" | "data" | "condition" | "end";

export interface FlowNode {
  label: string;
  sublabel?: string;
  type?: FlowNodeType;
}

export interface FlowDiagramProps {
  nodes: FlowNode[];
  arrows?: string[];
  caption?: string;
  /** Deprecated alias for caption (older lessons) */
  captionText?: string;
}

const nodeIcons: Record<FlowNodeType, string> = {
  trigger: "⚡",
  action: "→",
  code: "</>",
  data: "▤",
  condition: "◇",
  end: "●",
};

const nodeStyles: Record<FlowNodeType, { bg: string; border: string; text: string }> = {
  trigger: { bg: "#dbeafe", border: "#3b82f6", text: "#1d4ed8" },
  action: { bg: "#e0e7ff", border: "#6366f1", text: "#4338ca" },
  code: { bg: "#f3e8ff", border: "#a855f7", text: "#7e22ce" },
  data: { bg: "#dbedff", border: "#0ea5e9", text: "#0369a1" },
  condition: { bg: "#fef3c7", border: "#f59e0b", text: "#b45309" },
  end: { bg: "#dcfce7", border: "#16a34a", text: "#15803d" },
};

export default function FlowDiagram({ nodes, arrows = [], caption, captionText }: FlowDiagramProps) {
  return (
    <div className="flow-wrap not-content my-6">
      <div className="flow-row">
        {nodes.map((node, i) => {
          const type = node.type ?? "action";
          const style = nodeStyles[type] ?? nodeStyles.action;
          return (
            <Fragment key={i}>
              <div
                className={"flow-node" + (type === "trigger" ? " flow-node-trigger" : "")}
                style={{
                  ["--node-bg" as string]: style.bg,
                  ["--node-border" as string]: style.border,
                  ["--node-text" as string]: style.text,
                }}
              >
                <span className="node-icon" aria-hidden="true">
                  {nodeIcons[type]}
                </span>
                <span className="node-body">
                  <span className="node-label">{node.label}</span>
                  {node.sublabel && <span className="node-sub">{node.sublabel}</span>}
                </span>
              </div>
              {i < nodes.length - 1 && (
                <div className="flow-arrow-wrap">
                  {arrows[i] && <span className="arrow-label">{arrows[i]}</span>}
                  <svg className="arrow-svg" viewBox="0 0 48 20" aria-hidden="true">
                    <line x1="2" y1="10" x2="38" y2="10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <polyline points="34,5 44,10 34,15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
                  </svg>
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
      {(caption ?? captionText) && <p className="flow-caption">{caption ?? captionText}</p>}
    </div>
  );
}
