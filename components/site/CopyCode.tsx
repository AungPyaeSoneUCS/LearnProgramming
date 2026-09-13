"use client";

import { useEffect } from "react";

const COPY_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>';

const CHECK_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>';

const TOAST_STYLE = `
@keyframes cc-toast-in {
  from { opacity: 0; transform: translate(-50%, -10px) scale(0.96); }
  to { opacity: 1; transform: translate(-50%, 0) scale(1); }
}
@keyframes cc-toast-out {
  from { opacity: 1; transform: translate(-50%, 0) scale(1); }
  to { opacity: 0; transform: translate(-50%, -10px) scale(0.96); }
}
`;

interface Toast {
  el: HTMLElement;
  hideTimer: ReturnType<typeof setTimeout>;
  removeTimer: ReturnType<typeof setTimeout>;
}

let activeToast: Toast | null = null;

function ensureToastStyles() {
  if (document.getElementById("cc-toast-styles")) return;
  const style = document.createElement("style");
  style.id = "cc-toast-styles";
  style.textContent = TOAST_STYLE;
  document.head.appendChild(style);
}

function showToast() {
  ensureToastStyles();

  if (activeToast) {
    clearTimeout(activeToast.hideTimer);
    clearTimeout(activeToast.removeTimer);
    activeToast.el.remove();
    activeToast = null;
  }

  const el = document.createElement("div");
  el.setAttribute("role", "status");
  el.style.cssText = [
    "position:fixed",
    "top:22px",
    "left:50%",
    "transform:translate(-50%,0)",
    "z-index:9999",
    "display:flex",
    "align-items:center",
    "gap:8px",
    "padding:10px 16px",
    "border-radius:9999px",
    "background:hsl(var(--popover))",
    "color:hsl(var(--popover-foreground))",
    "border:1px solid hsl(var(--border))",
    "box-shadow:0 10px 30px rgba(2,6,23,0.28)",
    "font-family:system-ui,sans-serif",
    "font-size:0.875rem",
    "font-weight:600",
    "letter-spacing:0.01em",
    "animation:cc-toast-in 0.2s ease-out",
    "pointer-events:none",
  ].join(";");
  el.innerHTML = `${CHECK_ICON}<span>Copied Code</span>`;

  document.body.appendChild(el);

  const hideTimer = setTimeout(() => {
    el.style.animation = "cc-toast-out 0.18s ease-in forwards";
  }, 1200);

  const removeTimer = setTimeout(() => {
    el.remove();
    if (activeToast?.el === el) activeToast = null;
  }, 1400);

  activeToast = { el, hideTimer, removeTimer };
}

/**
 * CopyCode — client-side enhancer that adds a "copy" button to every <pre>
 * block rendered inside .lesson-content (works for fenced code, rehype-pretty-code
 * figures, and the <Code> component alike). The chip uses fixed colors because the
 * code background is always dark (#0f172a) regardless of light/dark theme, so it
 * stays visible in both modes. Shows a "Copied Code" toast after each copy.
 */
export function CopyCode() {
  useEffect(() => {
    const article = document.querySelector(".lesson-content");
    if (!article) return;

    const pres = article.querySelectorAll("pre");
    const cleanups: Array<() => void> = [];
    const timers: Array<ReturnType<typeof setTimeout>> = [];

    pres.forEach((pre) => {
      if (!(pre instanceof HTMLElement)) return;
      if (!pre.textContent || pre.textContent.trim().length < 1) return;

      const container = pre.closest("figure") ?? pre;
      if (!(container instanceof HTMLElement)) return;
      if (container.querySelector("[data-code-copy]")) return;
      if (getComputedStyle(container).position === "static") {
        container.style.position = "relative";
      }

      const btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("data-code-copy", "true");
      btn.setAttribute("aria-label", "Copy code");
      btn.title = "Copy code";
      btn.innerHTML = COPY_ICON;
      btn.style.cssText = [
        "position:absolute",
        "right:10px",
        "top:10px",
        "z-index:10",
        "display:flex",
        "height:30px",
        "width:30px",
        "align-items:center",
        "justify-content:center",
        "border-radius:8px",
        "border:1px solid rgba(15,23,42,0.14)",
        "background:rgba(255,255,255,0.94)",
        "color:#475569",
        "box-shadow:0 1px 4px rgba(2,6,23,0.35)",
        "transition:background 0.15s ease,color 0.15s ease,box-shadow 0.15s ease,transform 0.1s ease",
        "cursor:pointer",
        "backdrop-filter:blur(4px)",
      ].join(";");

      container.addEventListener("mouseenter", () => {
        btn.style.background = "#ffffff";
        btn.style.color = "#0f172a";
        btn.style.boxShadow = "0 2px 8px rgba(2,6,23,0.5)";
      });
      container.addEventListener("mouseleave", () => {
        btn.style.background = "rgba(255,255,255,0.94)";
        btn.style.color = "#475569";
        btn.style.boxShadow = "0 1px 4px rgba(2,6,23,0.35)";
      });

      let timer: ReturnType<typeof setTimeout> | undefined;
      btn.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const text = pre.innerText.replace(/\n+$/, "");
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          const ta = document.createElement("textarea");
          ta.value = text;
          ta.style.position = "fixed";
          ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          ta.remove();
        }
        btn.innerHTML = CHECK_ICON;
        btn.style.color = "#059669";
        btn.style.background = "#ffffff";
        btn.style.transform = "scale(0.92)";
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          btn.innerHTML = COPY_ICON;
          btn.style.color = "#475569";
          btn.style.transform = "scale(1)";
        }, 1500);
        if (timer) timers.push(timer);

        showToast();
      });

      container.appendChild(btn);
      cleanups.push(() => {
        container.removeChild(btn);
      });
    });

    return () => {
      timers.forEach((t) => clearTimeout(t));
      cleanups.forEach((fn) => fn());
      if (activeToast) {
        clearTimeout(activeToast.hideTimer);
        clearTimeout(activeToast.removeTimer);
        activeToast.el.remove();
        activeToast = null;
      }
    };
  }, []);

  return null;
}