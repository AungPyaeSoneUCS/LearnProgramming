import type { ReactNode } from "react";

export default function Card({ title, icon, children }: { title?: string; icon?: string; children?: ReactNode }) {
  return (
    <div data-slot="card" className="neo-card flex h-full flex-col gap-3 rounded-2xl p-5">
      {title && (
        <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-gray-50">
          {icon && <span aria-hidden="true">{icon}</span>}
          {title}
        </h3>
      )}
      <div className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 [&>p]:m-0">{children}</div>
    </div>
  );
}
