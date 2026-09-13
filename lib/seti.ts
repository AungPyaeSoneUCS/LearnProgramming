const seti: Record<string, string> = {
  javascript: 'code2',
  html: 'filetype-html',
  css: 'filetype-css',
  typescript: 'filetype-typescript',
  json: 'filetype-json',
  python: 'filetype-python',
  sql: 'database',
  bash: 'terminal',
  shell: 'terminal',
  git: 'git-branch',
  markdown: 'filetype-md',
};

export function setiIcon(name: string): string {
  const key = String(name || "").replace("seti:", "");
  return seti[key] ?? "file-code";
}
