'use client';

/**
 * Interactive practice-problem view for the SEO pages
 * (/practice/kangaroo/grade-3/<slug>/ etc.).
 *
 * Follows the kangaroo hub's no-spoiler pattern: the answer and explanation
 * stay hidden until the visitor picks an option or taps "Show answer".
 *
 * Deliberately fires no Pixel game events: these pages are reference
 * content, and their traffic is measured through PageView-by-URL and
 * Google Search Console, not the game funnel.
 */
import { useState } from 'react';
import Link from 'next/link';

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

export interface PracticeProblemViewData {
  gradeLabel: string;
  title: string;
  category: string;
  points: number;
  question: string;
  options: [string, string, string, string, string];
  answer: number;
  explanation: string;
}

export interface PracticeNavLink {
  title: string;
  path: string;
}

export function PracticeProblemView({
  problem,
  gradeIndexPath,
  prev,
  next,
}: {
  problem: PracticeProblemViewData;
  gradeIndexPath: string;
  prev: PracticeNavLink | null;
  next: PracticeNavLink | null;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const answered = picked !== null || revealed;

  const choose = (idx: number) => {
    if (answered) return;
    setPicked(idx);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-6">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/tools/kangaroo/" className="hover:underline">
              Kangaroo Prep
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href={gradeIndexPath} className="hover:underline">
              {problem.gradeLabel} Practice
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-foreground font-medium">
            {problem.title}
          </li>
        </ol>
      </nav>

      <h1 className="text-3xl font-bold mb-2">{problem.title}</h1>
      <p className="text-muted-foreground mb-5">
        {problem.gradeLabel} · Math Kangaroo-style practice problem · try it
        yourself, then check the answer
      </p>

      <div className="rounded-2xl border border-emerald-200/80 dark:border-emerald-800/40 bg-white/80 dark:bg-card/80 p-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300">
            {problem.points} points
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {problem.category}
          </span>
        </div>

        <p className="text-lg leading-relaxed mb-5">{problem.question}</p>

        <div className="grid gap-2" role="group" aria-label="Answer choices">
          {problem.options.map((opt, i) => {
            const isAnswer = i === problem.answer;
            const isPicked = picked === i;
            let cls =
              'border-slate-200 dark:border-slate-700 hover:border-emerald-400 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/30';
            if (answered) {
              if (isAnswer)
                cls =
                  'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 font-semibold';
              else if (isPicked)
                cls = 'border-red-400 bg-red-50 dark:bg-red-950/30';
              else cls = 'border-slate-200 dark:border-slate-700 opacity-60';
            }
            return (
              <button
                key={i}
                type="button"
                disabled={answered}
                onClick={() => choose(i)}
                aria-pressed={isPicked}
                data-testid="practice-option"
                className={`flex items-center gap-3 text-left px-4 py-3 rounded-xl border-2 transition-all ${cls} disabled:cursor-default`}
              >
                <span className="shrink-0 w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm font-bold">
                  {LETTERS[i]}
                </span>
                <span>{opt}</span>
                {answered && isAnswer && (
                  <span className="ml-auto text-emerald-600 text-xl" aria-hidden>
                    ✓
                  </span>
                )}
                {answered && isPicked && !isAnswer && (
                  <span className="ml-auto text-red-500 text-xl" aria-hidden>
                    ✗
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {!answered && (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setRevealed(true)}
              data-testid="practice-show-answer"
              className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 hover:underline"
            >
              Show answer
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              data-testid="practice-print"
              className="text-sm font-semibold px-4 py-2 rounded-full border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              🖨️ Print this problem
            </button>
          </div>
        )}

        {answered && (
          <div
            className="mt-5 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800"
            data-testid="practice-explanation"
          >
            <p className="font-semibold mb-1">
              {picked === problem.answer
                ? '🎉 Correct! Nice work.'
                : picked !== null
                  ? `Not quite — the answer is ${LETTERS[problem.answer]}.`
                  : `The answer is ${LETTERS[problem.answer]}.`}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {problem.explanation}
            </p>
            <button
              type="button"
              onClick={() => window.print()}
              className="mt-3 text-sm font-semibold px-4 py-2 rounded-full border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              🖨️ Print this problem
            </button>
          </div>
        )}
      </div>

      {/* Prev / next */}
      <div className="flex items-center justify-between gap-4 mb-8">
        {prev ? (
          <Link
            href={prev.path}
            className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 hover:underline"
          >
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={next.path}
            className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 hover:underline text-right"
          >
            {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </div>

      {/* CTA */}
      <div className="rounded-2xl border p-6 mb-8 text-center bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border-emerald-200/60 dark:border-emerald-800/40">
        <p className="font-bold text-lg mb-1">
          Want a timed challenge?
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Try the 8-question, 12-minute Kangaroo quiz — or print a full
          worksheet.
        </p>
        <Link
          href="/tools/kangaroo/"
          className="inline-block px-6 py-2.5 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
        >
          Open Kangaroo Prep →
        </Link>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        Original problem written for Great Seattle Life Hacks in the Math
        Kangaroo spirit. Not a past contest question and not affiliated with
        or endorsed by Math Kangaroo.
      </p>
    </div>
  );
}
