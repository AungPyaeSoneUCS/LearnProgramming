"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import type { NavCourse } from "@/lib/lessons";

import CoursesSidebar from "@/components/CoursesSidebar";

export interface LessonDrawerProps {
  courses: NavCourse[];
}

export function LessonDrawer({ courses }: LessonDrawerProps) {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn btn-outline btn-sm"
      >
        <Menu className="size-4" />
        သင်ခန်းစာများ
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="သင်ခန်းစာများ">
          <div
            className="animate-overlay-in absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={close}
          />
          <div className="animate-panel-in-left absolute inset-y-0 left-0 flex w-80 max-w-[85vw] flex-col bg-background shadow-2xl shadow-black/20">
            <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
              <span className="text-sm font-bold text-foreground">သင်ခန်းစာများ</span>
              <button
                type="button"
                onClick={close}
                aria-label="မီနူးပိတ်ရန်"
                className="btn btn-icon btn-ghost"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4" onClick={close}>
              <CoursesSidebar courses={courses} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}