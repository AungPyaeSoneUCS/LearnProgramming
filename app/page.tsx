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

const GITHUB_URL = "https://github.com/AungPyaeSoneUCS/LearnProgramming";

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

  const totalLessons = cards.reduce((sum, c) => sum + c.count, 0);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-4 pb-16 pt-6 lg:px-8">
      <section className="hero-gradient relative overflow-hidden rounded-3xl border border-border/70 bg-background px-5 py-10 sm:px-10 sm:py-14">
        <span
          aria-hidden
          className="pointer-events-none absolute -right-16 top-1/2 size-64 -translate-y-1/2 rounded-full bg-amber-500/10 blur-3xl"
        />
        <div className="relative max-w-3xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-700 ring-1 ring-inset ring-amber-500/20 dark:text-amber-300">
            <span aria-hidden>📚</span>
            {cards.length} သင်တန်း · {totalLessons} သင်ခန်းစာ · အခမဲ့သင်ယူပါ
          </p>
          <h1 className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            ပရိုဂရမ်းမင်း သင်ယူခြင်း
            <span className="text-amber-600 dark:text-amber-400"> — မြန်မာလို</span>
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Python မှ WebSocket ထိ၊ TypeScript နှင့် Database များအပါအဝင် ခေတ်စားသော
            programming ဘာသာရပ်များကို မြန်မာဘာသာဖြင့် အဆင့်ဆင့် လေ့လာနိုင်ပါသည်။
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a href="#course-catalog" className="btn btn-primary btn-lg">
              သင်တန်းအားလုံး ကြည့်ရန်
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden="true">
                <path d="M12 5v14" />
                <path d="m19 12-7 7-7-7" />
              </svg>
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-lg"
            >
              GitHub Repository
            </a>
          </div>
        </div>
      </section>

      <div className="flex-1 pt-12">
        <CourseCatalog courses={cards} />
      </div>
    </div>
  );
}