"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "takkatho:completed";

export interface LessonCompletionProps {
  lessonId?: string;
  lessonTitle?: string;
}

let cached: string[] = [];

const readCompleted = (): string[] => {
  if (typeof window === "undefined") return cached;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const next = raw ? (JSON.parse(raw) as string[]) : [];
    if (next.length !== cached.length || next.some((id, i) => id !== cached[i])) {
      cached = next;
    }
  } catch {
    /* storage unavailable */
  }
  return cached;
};

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("takkatho-completed", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("takkatho-completed", callback);
  };
}

function emitChange() {
  window.dispatchEvent(new Event("takkatho-completed"));
}

export default function LessonCompletion({ lessonId, lessonTitle }: LessonCompletionProps) {
  const completed = useSyncExternalStore(subscribe, readCompleted, readCompleted);

  if (!lessonId) return null;
  const done = completed.includes(lessonId);

  const toggle = () => {
    setCompletedLocally(done ? completed.filter((id) => id !== lessonId) : [...completed, lessonId]);
  };

  function setCompletedLocally(next: string[]) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      cached = next;
    } catch {
      /* storage unavailable */
    }
    emitChange();
  }

  return (
    <div className="not-content my-8 flex items-center justify-between gap-4 rounded-2xl border border-border bg-gradient-to-br from-amber-50 to-emerald-50 p-5 dark:from-amber-950/30 dark:to-emerald-950/30">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          aria-pressed={done}
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
            done ? "bg-emerald-500" : "bg-border"
          }`}
        >
          <span
            className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform ${
              done ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
        <div>
          <p className="text-sm font-bold text-foreground">
            {done ? "သင်ခန်းစာ ပြီးပါပြီ" : "သင်ခန်းစာ ပြီးအောင် အမှတ်အသားလုပ်မည်"}
          </p>
          {lessonTitle && (
            <p className="text-xs text-muted-foreground">{lessonTitle}</p>
          )}
        </div>
      </div>
      <span
        className={`hidden shrink-0 rounded-full px-3 py-1 text-xs font-semibold sm:inline-block ${
          done
            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {done ? "ပြီးဆုံး" : "တိုးတက်မှု"}
      </span>
    </div>
  );
}
