const iconMap: Record<string, string> = {
  // Starlight link-card icons used across lessons
  rocket: "🚀",
  puzzle: "🧩",
  "git-branch": "🌿",
  "open-book": "📖",
  "seti:javascript": "JS",
  "seti:html": "5",
  "seti:css": "#",
  "right-arrow": "→",
  star: "⭐",
  "external-link": "↗",
  warning: "⚠️",
  tip: "💡",
  sql: "🗄️",
};

export default function Icon({
  name,
  size = "1.2em",
}: {
  name: string;
  size?: string | number;
  className?: string;
}) {
  const glyph = iconMap[name];
  return (
    <span
      aria-hidden="true"
      style={{ fontSize: size, lineHeight: 1 }}
      className="inline-flex shrink-0 items-center justify-center font-bold"
    >
      {glyph ?? "📘"}
    </span>
  );
}
