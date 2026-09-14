import {
  getNavCourses,
  courseIntroSlug,
  courseLessonCount,
  toUrl,
} from "@/lib/lessons";
import CourseCatalog, { type CourseCardData } from "@/components/home/CourseCatalog";
import courseMeta from "@/data/course-meta.json";

type CourseMeta = {
  label: string;
  description: string;
  icon: string;
  color: string;
};

export default function HomePage() {
  const courses = getNavCourses();

  const cards: CourseCardData[] = courses
    .map((course) => {
      const meta = (courseMeta as CourseMeta[]).find((m) => m.label === course.label);
      const intro = courseIntroSlug(course);
      return {
        label: course.label,
        href: intro ? toUrl(intro) : "/courses",
        count: courseLessonCount(course),
        description: meta?.description ?? "",
        icon: meta?.icon ?? "📘",
        color: meta?.color ?? "#b45309",
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label, "en", { sensitivity: "base", numeric: true }));

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-4 pb-16 pt-6 lg:px-8">
      <CourseCatalog courses={cards} />
    </div>
  );
}