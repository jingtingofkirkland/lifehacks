import type { Metadata } from 'next';
import Link from 'next/link';
import { SubscribeCta } from '@/components/SubscribeCta';
import { BUNDLE_PROBLEM_COUNT, BUNDLE_WEEKS } from './bundle';
import { BundlePrintButton } from './BundlePrintButton';

export const metadata: Metadata = {
  title:
    '5-Week Cohort Bundle: 15 Kangaroo Problems to Print (Grades 3–4) - Great Seattle Life Hacks',
  description:
    'Print the free 5-week Kangaroo cohort bundle: 15 Kangaroo-style problems from the first five weeks of the 20-week companion run — think backwards, logic, weighing, counting, shapes — with hints and a full answer key.',
  alternates: {
    canonical:
      'https://lifehacks.zeey-app.net/kangaroo-2027/cohort/bundle/',
  },
};

const BUNDLE_FOOTER =
  'Enjoyed this? Get a fresh problem set every week → lifehacks.zeey-app.net/newsletter';

function SheetFooter() {
  return (
    <p className="mt-10 pt-3 border-t border-slate-200 text-[11px] text-slate-400 text-center">
      {BUNDLE_FOOTER} · Free for home and classroom use — copy as much as
      you like.
    </p>
  );
}

/**
 * The 5-Week Cohort Bundle (IDEA-20261122-02): the first five weeks of
 * the Kangaroo 2027 companion cohort as one printable pack — 15 problems
 * (3 per week), hints on the sheets, answer key at the end. Weeks 1/3/4
 * reuse the problems from Weekly Worksheet Issues 2/3/4; Weeks 2/5 were
 * written for this bundle in the same format (see ./bundle.ts).
 * Print styling follows the 5-Day Challenge Pack pattern: screen chrome
 * is hidden and each week lands on its own printed page.
 */
export default function CohortBundlePage() {
  return (
    <article className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50/60 to-background dark:from-orange-950/30 dark:via-amber-950/20 dark:to-background">
      {/* print stylesheet: only the bundle sheets survive printing */}
      <style>{`
        @media print {
          .cb-no-print { display: none !important; }
          .cb-sheet {
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            margin: 0 !important;
            break-after: page;
          }
          .cb-sheet:last-child { break-after: auto; }
        }
      `}</style>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* ── Screen-only header ── */}
        <div className="cb-no-print">
          <nav
            aria-label="Breadcrumb"
            className="text-sm text-muted-foreground mb-6"
          >
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/kangaroo-2027/" className="hover:underline">
                  Math Kangaroo 2027
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link
                  href="/kangaroo-2027/cohort/"
                  className="hover:underline"
                >
                  20-Week Cohort
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-foreground font-medium">
                5-Week Bundle
              </li>
            </ol>
          </nav>

          <div className="mt-8 mb-6 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-700 via-amber-600 to-yellow-600 dark:from-orange-400 dark:via-amber-400 dark:to-yellow-400 bg-clip-text text-transparent">
              The 5-Week Cohort Bundle 🦘
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
              The first five weeks of the Kangaroo companion run in one
              printable pack — {BUNDLE_PROBLEM_COUNT} Kangaroo-style problems
              for grades 3–4, one week at a time, with the answer key at
              the end.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 mb-6">
            <BundlePrintButton testId="cb-bundle-print" />
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Prints 6 pages: one sheet per week, plus the answer key.
              Black-and-white friendly — plain paper and a regular printer
              are all you need. Prefer single weeks? Print just that page
              range in the print dialog.
            </p>
          </div>

          <div className="rounded-2xl border border-orange-200/80 dark:border-orange-800/40 bg-white/80 dark:bg-card/80 p-5 mb-10 text-sm leading-relaxed">
            <p className="font-semibold mb-1">How to use it</p>
            <p className="text-muted-foreground">
              One week per sitting, or one problem a day — each problem is
              marked 3, 4, or 5 points, Kangaroo-style. Kids try first;
              the hint is there when they get stuck. Keep the answer key
              to yourself until the end, then talk through the
              explanations together. When you finish Week 5, the Friday
              email picks up the run — subscribe below and the next weeks
              land in your inbox.
            </p>
          </div>
        </div>

        {/* ── Printable week sheets ── */}
        <div>
          {BUNDLE_WEEKS.map((week) => (
            <section
              key={week.week}
              data-testid={`cb-week-${week.week}`}
              className="cb-sheet rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-card shadow-sm p-6 sm:p-10 mb-8 text-slate-900 dark:text-slate-100"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-slate-800 dark:border-slate-200 pb-3 mb-6">
                <p className="text-sm font-black uppercase tracking-widest">
                  Week {week.week} · {week.datesLabel}
                </p>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Cohort bundle · Grades 3–4
                </p>
              </div>

              <p className="text-2xl font-bold mb-2">{week.theme}</p>
              <p className="text-sm text-slate-500 leading-relaxed mb-8">
                {week.intro}
              </p>

              <div className="flex justify-between text-sm mb-8">
                <span>
                  Name:{' '}
                  <span className="inline-block w-48 border-b border-slate-400" />
                </span>
                <span>
                  Date:{' '}
                  <span className="inline-block w-32 border-b border-slate-400" />
                </span>
              </div>

              <ol className="space-y-10">
                {week.problems.map((problem, i) => (
                  <li key={i}>
                    <p className="font-bold text-lg mb-2">
                      {problem.points} points · {problem.tag}
                    </p>
                    <p className="text-xl leading-relaxed font-medium mb-3">
                      {problem.question}
                    </p>
                    <p className="text-sm text-slate-500 leading-relaxed mb-6">
                      Hint: {problem.hint}
                    </p>
                    <p className="text-sm font-semibold text-slate-500 mb-2">
                      Show your work:
                    </p>
                    <div aria-hidden className="space-y-7">
                      <div className="border-b border-dashed border-slate-300" />
                      <div className="border-b border-dashed border-slate-300" />
                      <div className="border-b border-dashed border-slate-300" />
                    </div>
                  </li>
                ))}
              </ol>

              <SheetFooter />
            </section>
          ))}

          {/* ── Answer key ── */}
          <section
            data-testid="cb-answer-key"
            className="cb-sheet rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-card shadow-sm p-6 sm:p-10 mb-8 text-slate-900 dark:text-slate-100"
          >
            <div className="border-b-2 border-slate-800 dark:border-slate-200 pb-3 mb-6">
              <p className="text-sm font-black uppercase tracking-widest">
                Answer Key &amp; Explanations
              </p>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1">
                For parents &amp; teachers — no peeking until the week is
                done, kids! 🙈
              </p>
            </div>

            <ol className="space-y-8">
              {BUNDLE_WEEKS.map((week) => (
                <li key={week.week}>
                  <p className="font-bold text-lg mb-3">
                    Week {week.week} — {week.theme}
                  </p>
                  <ol className="space-y-4">
                    {week.problems.map((problem, i) => (
                      <li key={i}>
                        <p>
                          {problem.points} points · {problem.tag} — Answer:{' '}
                          <strong>{problem.answer}</strong>
                        </p>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                          {problem.explanation}
                        </p>
                      </li>
                    ))}
                  </ol>
                </li>
              ))}
            </ol>

            <SheetFooter />
          </section>
        </div>

        {/* ── Screen-only footer ── */}
        <div className="cb-no-print">
          <div className="mb-10">
            <SubscribeCta />
            <p className="text-sm text-muted-foreground leading-relaxed mt-3">
              Finished all five weeks? The cohort keeps going to contest day
              (March 18, 2027) — the Friday email carries each new week,
              plus that week&apos;s printable.
            </p>
          </div>
          <p className="text-center">
            <Link
              href="/kangaroo-2027/cohort/"
              className="text-sm font-semibold text-primary hover:underline"
            >
              ← Back to the 20-week cohort plan
            </Link>
          </p>
        </div>
      </div>
    </article>
  );
}
