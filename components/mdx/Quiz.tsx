"use client";

import { useState } from "react";

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface QuizProps {
  title?: string;
  questions?: QuizQuestion[];
}

export default function Quiz({ title, questions = [] }: QuizProps) {
  const [answers, setAnswers] = useState<Record<string, number | undefined>>({});
  const [revealed, setRevealed] = useState(false);
  if (questions.length === 0) return null;

  const allAnswered = questions.every((q) => answers[q.id] !== undefined);
  const score = revealed
    ? questions.reduce((acc, q) => acc + (answers[q.id] === q.correctAnswer ? 1 : 0), 0)
    : 0;

  return (
    <section className="my-8 overflow-hidden rounded-2xl border border-border bg-card shadow-sm not-content">
      <div className="flex items-center justify-between border-b border-border bg-muted/50 px-5 py-3">
        <h3 className="text-sm font-bold text-foreground">{title ?? "စာမေးပွဲ"}</h3>
        {revealed && (
          <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
            ရမှတ်: {score} / {questions.length}
          </span>
        )}
      </div>
      <div className="space-y-6 px-5 py-5">
        {questions.map((q) => {
          const chosen = answers[q.id];
          return (
            <div key={q.id}>
              <p className="mb-3 font-semibold text-foreground">
                <span className="mr-2 text-amber-600 dark:text-amber-400">Q{q.id.replace(/\D/g, "")}</span>
                {q.question}
              </p>
              <div className="space-y-2">
                {q.options.map((opt, i) => {
                  const isCorrect = revealed && i === q.correctAnswer;
                  const isWrong = revealed && chosen === i && chosen !== q.correctAnswer;
                  return (
                    <label
                      key={i}
                      className={`flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                        isCorrect
                          ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100"
                          : isWrong
                          ? "border-red-500 bg-red-50 text-red-900 dark:bg-red-950/40 dark:text-red-100"
                          : chosen === i
                          ? "border-amber-500 bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-100"
                          : "border-border hover:border-amber-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        disabled={revealed}
                        checked={chosen === i}
                        onChange={() => setAnswers((a) => ({ ...a, [q.id]: i }))}
                        className="mt-0.5 accent-amber-600"
                      />
                      <span>{opt}</span>
                    </label>
                  );
                })}
              </div>
              {revealed && q.explanation && (
                <p className="mt-2 rounded-lg bg-muted/60 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
                  {q.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-3 border-t border-border px-5 py-3">
        <button
          onClick={() => setRevealed(true)}
          disabled={!allAnswered}
          className="btn btn-primary"
        >
          စစ်ဆေးမည်
        </button>
        {revealed && (
          <button
            onClick={() => {
              setAnswers({});
              setRevealed(false);
            }}
            className="btn btn-ghost btn-sm"
          >
            ပြန်စမည်
          </button>
        )}
      </div>
    </section>
  );
}
