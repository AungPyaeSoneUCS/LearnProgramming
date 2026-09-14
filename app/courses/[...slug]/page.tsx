import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronRight, Home } from "lucide-react";

import { mdxComponents } from "@/components/mdx";
import { CopyCode } from "@/components/site/CopyCode";
import { LessonDrawer } from "@/components/courses/LessonDrawer";
import { MobileTableOfContents } from "@/components/site/MobileTableOfContents";
import { ReadingProgress } from "@/components/site/ReadingProgress";
import { TableOfContents } from "@/components/site/TableOfContents";
import { getAllLeafSlugs, getNavCourses, getSiblings, courseInfo, toUrl } from "@/lib/lessons";
import { renderLesson } from "@/lib/mdx";

export const dynamicParams = false;

export interface LessonPageProps {
  params: Promise<{ slug: string[] }>;
}

export function generateStaticParams() {
  return getAllLeafSlugs().map((slug) => ({ slug: slug.split("/") }));
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { slug } = await params;
  const lesson = await renderLesson(slug.join("/"));
  if (!lesson) return { title: "မတွေ့ပါ" };
  return { title: lesson.title, description: lesson.description };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug: slugArray } = await params;
  const lessonSlug = slugArray.join("/");
  const lesson = await renderLesson(lessonSlug);
  if (!lesson) notFound();

  const courses = getNavCourses();
  const siblings = getSiblings(lessonSlug);
  const course = courseInfo(lessonSlug);

  return (
    <>
      <ReadingProgress />

      <div className="flex w-full items-center justify-between gap-4 lg:hidden">
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm">
          <Link href="/" className="shrink-0 text-muted-foreground no-underline transition-colors hover:text-amber-600 dark:hover:text-amber-400">
            <Home className="h-4 w-4" />
          </Link>
          {course && (
            <>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
              <a
                href={toUrl(course.introSlug)}
                className="truncate font-bold text-amber-600 no-underline hover:underline dark:text-amber-400"
              >
                {course.label}
              </a>
            </>
          )}
        </nav>
        <LessonDrawer courses={courses} />
      </div>

      <MobileTableOfContents items={lesson.toc} />

      <div className="flex w-full gap-10">
        <div className="min-w-0 flex-1">
          <header className="mb-8 border-b border-border/70 pb-6">
            <nav aria-label="Breadcrumb" className="mb-3 hidden items-center gap-1.5 text-sm lg:flex">
              <Link href="/" className="text-muted-foreground no-underline transition-colors hover:text-amber-600 dark:hover:text-amber-400">
                <Home className="h-4 w-4" />
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
              <a
                href={toUrl(course?.introSlug ?? lessonSlug)}
                className="font-bold text-amber-600 no-underline hover:underline dark:text-amber-400"
              >
                {course?.label ?? "သင်တန်းများ"}
              </a>
            </nav>

            <h1 className="text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              {lesson.title}
            </h1>
            {lesson.description && (
              <p className="mt-3 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground">
                {lesson.description}
              </p>
            )}
            {course && (
              <a
                href={toUrl(course.introSlug)}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 no-underline transition-colors hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
              >
                <ArrowLeft className="h-4 w-4" />
                {course.label} သင်ရိုးသို့ ပြန်သွားရန်
              </a>
            )}
          </header>

          <article className="lesson-content mx-auto max-w-[46rem]">
            <lesson.MDXContent components={mdxComponents} />
            <CopyCode />
          </article>

          <nav className="mt-12 grid grid-cols-2 gap-4 border-t border-border pt-6" aria-label="Pagination">
            {siblings.prev ? (
              <a
                href={toUrl(siblings.prev.slug)}
                className="group flex flex-col rounded-2xl border border-border bg-card p-4 no-underline transition-all hover:-translate-y-0.5 hover:border-amber-500/60 hover:shadow-[0_6px_20px_-10px_rgba(245,158,11,0.35)]"
              >
                <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                  ယခင်
                </span>
                <span className="mt-1.5 line-clamp-2 font-bold text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400">
                  {siblings.prev.label}
                </span>
              </a>
            ) : (
              <span />
            )}
            {siblings.next ? (
              <a
                href={toUrl(siblings.next.slug)}
                className="group flex flex-col items-end rounded-2xl border border-border bg-card p-4 text-right no-underline transition-all hover:-translate-y-0.5 hover:border-amber-500/60 hover:shadow-[0_6px_20px_-10px_rgba(245,158,11,0.35)]"
              >
                <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  နောက်တစ်ခု
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
                <span className="mt-1.5 line-clamp-2 font-bold text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400">
                  {siblings.next.label}
                </span>
              </a>
            ) : (
              <span />
            )}
          </nav>
        </div>

        <TableOfContents items={lesson.toc} />
      </div>
    </>
  );
}