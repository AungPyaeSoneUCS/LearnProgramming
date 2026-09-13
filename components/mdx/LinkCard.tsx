import type { ReactNode } from "react";

import { ArrowRight } from "lucide-react";

import Icon from "./Icon";

export interface LinkCardProps {
  title: string;
  description?: string;
  href: string;
  icon?: string;
}

const iconFor = (icon?: string): { name?: string; emoji?: string } => {
  if (!icon) return {};
  if (icon.startsWith("seti:")) return { name: icon.slice(5) };
  if (icon.startsWith("emoji:") || icon.length <= 2) return { emoji: icon.replace(/^emoji:/, "") };
  return { name: icon.replace(/^seti:/, "") };
};

export default function LinkCard({ title, description, href, icon }: LinkCardProps) {
  const { name, emoji } = iconFor(icon);
  return (
    <a
      href={href}
      className="group relative block h-full rounded-2xl border border-border bg-card p-5 no-underline transition-all hover:-translate-y-0.5 hover:border-amber-500/50 hover:shadow-[0_6px_20px_-8px_rgba(245,158,11,0.35)]"
    >
      <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10">
        <span className="text-amber-600 dark:text-amber-400">
          {name ? <Icon name={name} size={18} /> : emoji ? <span aria-hidden>{emoji}</span> : <ArrowRight className="h-4 w-4" />}
        </span>
      </span>
      <span className="block text-base font-bold text-foreground">{title}</span>
      {description && (
        <span className="mt-1.5 block text-sm leading-relaxed text-muted-foreground">{description}</span>
      )}
      <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-amber-600 dark:text-amber-400">
        စတင်လေ့လာရန်
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </a>
  );
}

export const LinkCardGroup = ({ children }: { children?: ReactNode }) => (
  <div className="not-grid my-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
);
