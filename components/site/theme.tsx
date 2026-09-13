export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
(function () {
  var h = document.documentElement;
  var key = "theme-toggle";
  var system = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  var stored = localStorage.getItem(key);
  var theme = stored === "dark" || stored === "light" ? stored : system;
  h.classList.toggle("dark", theme === "dark");
  h.dataset.theme = theme;
  h.style.colorScheme = theme;
})();
`,
      }}
    />
  );
}