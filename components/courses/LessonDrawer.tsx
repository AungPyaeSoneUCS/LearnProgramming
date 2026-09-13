"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

import type { NavCourse } from "@/lib/lessons";

import CoursesSidebar from "@/components/CoursesSidebar";

export interface LessonDrawerProps {
  courses: NavCourse[];
}

export function LessonDrawer({ courses }: LessonDrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-semibold text-foreground transition-colors hover:border-amber-500/60 hover:bg-muted"
      >
        <Menu className="h-4 w-4" />
        သင်ခန်းစာများ
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-80 max-w-[85vw] flex-col bg-background shadow-2xl">
            <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
              <span className="text-sm font-bold text-foreground">သင်ခန်းစာများ</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="မီနူးပိတ်ရန်"
                className="cursor-pointer rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4" onClick={() => setOpen(false)}>
              <CoursesSidebar courses={courses} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}