"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";

export type CourseCardData = {
  label: string;
  href: string;
  count: number;
  description: string;
  icon: string;
  color: string;
};

const COLLAPSED = 10;

function Card({ course }: { course: CourseCardData }) {
  return (
    <Link
      href={course.href}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:border-amber-500/60 hover:shadow-xl hover:shadow-amber-500/10"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-8 size-24 rounded-full opacity-10 blur-2xl transition-opacity duration-200 group-hover:opacity-20"
        style={{ backgroundColor: course.color }}
      />
      <div className="flex items-center justify-between gap-2">
        <span
          aria-hidden
          className="flex size-12 shrink-0 items-center justify-center rounded-2xl text-2xl shadow-sm ring-1 ring-black/5"
          style={{
            backgroundImage: `linear-gradient(135deg, ${course.color}, ${course.color}99)`,
          }}
        >
          {course.icon}
        </span>
        <span className="shrink-0 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-700 dark:text-amber-400">
          {course.count} ခန်း
        </span>
      </div>

      <h2 className="mt-4 line-clamp-2 text-base font-bold leading-snug">{course.label}</h2>

      <p className="mt-1.5 line-clamp-3 text-[13px] leading-relaxed text-muted-foreground">
        {course.description}
      </p>

      <span className="mt-auto inline-flex items-center gap-1 pt-3 text-sm font-semibold text-amber-600 dark:text-amber-400">
        လေ့လာရန်
        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

export default function CourseCatalog({ courses }: { courses: CourseCardData[] }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? courses : courses.slice(0, COLLAPSED);
  const reveal = courses.length > COLLAPSED;
  const collapsed = !showAll && reveal;

  return (
    <div>
      <div
        className={
          collapsed
            ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:h-[calc(100vh-8rem)] xl:auto-rows-fr xl:grid-cols-5 xl:grid-rows-2"
            : "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
        }
      >
        {visible.map((course) => (
          <Card key={course.label} course={course} />
        ))}
      </div>

      {reveal && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-amber-500/60 hover:text-amber-600 dark:hover:text-amber-400"
          >
            {showAll ? (
              <>
                ချုံ့၍ ကြည့်ရန်
                <ChevronUp className="size-4" />
              </>
            ) : (
              <>
                သင်တန်းအားလုံး ({courses.length}) ကြည့်ရန်
                <ChevronDown className="size-4" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}