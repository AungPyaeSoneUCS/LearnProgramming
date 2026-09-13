import type { ReactNode } from "react";

export default function Steps({ children }: { children?: ReactNode }) {
  return (
    <div className="steps">
      <ol className="my-0 space-y-6">{children}</ol>
    </div>
  );
}
