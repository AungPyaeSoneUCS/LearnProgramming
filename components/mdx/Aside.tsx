import type { ReactNode } from "react";

const variantStyles = {
  note: { border: "border-blue-500/40", bg: "bg-blue-500/5", label: "text-blue-600 dark:text-blue-400", icon: "💡", labelText: "Note" },
  tip: { border: "border-emerald-500/40", bg: "bg-emerald-500/5", label: "text-emerald-600 dark:text-emerald-400", icon: "💡", labelText: "Tip" },
  caution: { border: "border-amber-500/40", bg: "bg-amber-500/5", label: "text-amber-600 dark:text-amber-400", icon: "⚠️", labelText: "Caution" },
  danger: { border: "border-red-500/40", bg: "bg-red-500/5", label: "text-red-600 dark:text-red-400", icon: "⛔", labelText: "Danger" },
} as const;

type AsideVariant = keyof typeof variantStyles;

export default function Aside({
  type = "note",
  title,
  icon,
  children,
}: {
  type?: AsideVariant;
  title?: string;
  icon?: string | boolean;
  children?: ReactNode;
}) {
  const s = variantStyles[type] ?? variantStyles.note;
  const iconChar = typeof icon === "string" ? icon : s.icon;
  return (
    <aside className={`my-6 rounded-xl border p-4 sm:p-5 ${s.border} ${s.bg}`}>
      <div className="flex items-center gap-2 mb-2">
        <span aria-hidden="true">{iconChar}</span>
        <span className={`text-sm font-bold ${s.label}`}>{title ?? s.labelText}</span>
      </div>
      <div className="text-sm leading-relaxed [&>p]:my-2 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0 [&>ul]:my-2 [&>ol]:my-2">
        {children}
      </div>
    </aside>
  );
}