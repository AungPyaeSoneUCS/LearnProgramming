import type { ReactNode } from "react";

export default function CardGrid({ className = "", children }: { className?: string; children?: ReactNode }) {
  return <div className={`neo-card-grid grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>{children}</div>;
}
