import type { ReactNode } from "react";

import { getNavCourses } from "@/lib/lessons";

import CoursesSidebar from "@/components/CoursesSidebar";

export interface CourseLayoutProps {
  children: ReactNode;
}

export default async function CourseLayout({ children }: CourseLayoutProps) {
  const courses = getNavCourses();

  return (
    <div className="mx-auto flex max-w-[1500px] gap-8 px-4 py-6 lg:px-8 lg:py-8">
      <aside className="hidden w-72 shrink-0 lg:block lg:sticky lg:top-16 lg:max-h-[calc(100vh-4.5rem)] lg:self-start lg:overflow-y-auto lg:pb-8 lg:pr-2">
        <CoursesSidebar courses={courses} />
      </aside>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}