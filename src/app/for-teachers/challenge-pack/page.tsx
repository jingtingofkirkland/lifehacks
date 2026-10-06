import type { Metadata } from 'next';
import Link from 'next/link';
import { PrintButton } from '../_components/PrintButton';
import { getPackQuestions } from './pack';

export const metadata: Metadata = {
  title:
    '5-Day Math Challenge Pack (Printable, Grades 3–4) - Great Seattle Life Hacks',
  description:
    'Print the free 5-Day Math Challenge Pack: five Kangaroo-style problems (easy to hard), a full answer key with explanations, and a class progress star poster for grades 3–4.',
  alternates: {
    canonical: 'https://lifehacks.zeey-app.net/for-teachers/challenge-pack/',
  },
};

const LETTERS = ['A', 'B', 'C', 'D', 'E'];
const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const PACK_FOOTER =
  'Enjoyed this? Get a fresh problem set every week → lifehacks.zeey-app.net/newsletter';

function SheetFooter() {
  return (
    <p className="mt-10 pt-3 border-t border-slate-200 text-[11px] text-slate-400 text-center">
      {PACK_FOOTER} · Free for classroom use — copy as much as you like.
    </p>
  );
}

/**
 * The printable 5-Day Math Challenge Pack: five problem sheets (one per
 * day), an answer key with explanations, and a class star poster.
 * Problems come from the shared Kangaroo-style bank (see ./pack.ts), so
 * this page always matches the online practice set. Print styling
 * follows the Kangaroo worksheet pattern: screen chrome is hidden and
 * each sheet lands on its own printed page.
 */
export default function ChallengePackPage() {
  const questions = getPackQuestions();

  return (
    <article className="min-h-screen bg-gradient-to-b from-emerald-50 via-teal-50/60 to-background dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-background">
      {/* print stylesheet: only the pack sheets survive printing */}
      <style>{`
        @media print {
          .ft-no-print { display: none !important; }
          .ft-sheet {
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            margin: 0 !important;
            break-after: page;
          }
          .ft-sheet:last-child { break-after: auto; }
        }
      `}</style>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* ── Screen-only header ── */}
        <div className="ft-no-print">
          <Link
            href="/for-teachers/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform"><path d="M15 18l-6-6 6-6"/></svg>
            Back to For Teachers
          </Link>

          <div className="mt-8 mb-6 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
              5-Day Math Challenge Pack
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
              One problem a day, Monday to Friday — plus the answer key and a
              star poster for your classroom wall.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 mb-6">
            <PrintButton label="🖨️ Print the whole pack" testId="ft-pack-print" />
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Prints 7 pages: 5 problem days, the answer key, and the class
              poster. Black-and-white friendly — plain paper and a regular
              printer are all you need. Prefer single days? Print just that
              page range in the print dialog.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-200/80 dark:border-emerald-800/40 bg-white/80 dark:bg-card/80 p-5 mb-10 text-sm leading-relaxed">
            <p className="font-semibold mb-1">How to run it</p>
            <p className="text-muted-foreground">
              Hand out (or project) one problem each morning as a 5–10 minute
              warm-up. Kids add a star to the poster for each day they try.
              Keep the answer key to yourself until Friday, then talk through
              the explanations together. Difficulty ramps from a gentle
              3-pointer on Monday to a real 5-point thinker on Friday.
            </p>
          </div>
        </div>

        {/* ── Printable sheets ── */}
        <div>
          {questions.map((q, i) => (
            <section
              key={q.id}
              className="ft-sheet rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-card shadow-sm p-6 sm:p-10 mb-8 text-slate-900 dark:text-slate-100"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-slate-800 dark:border-slate-200 pb-3 mb-6">
                <p className="text-sm font-black uppercase tracking-widest">
                  Day {i + 1} · {DAY_NAMES[i]}
                </p>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  5-Day Math Challenge · Grades 3–4 · {q.points} points
                </p>
              </div>

              <div className="flex justify-between text-sm mb-8">
                <span>
                  Name:{' '}
                  <span className="inline-block w-48 border-b border-slate-400" />
                </span>
                <span>
                  Class:{' '}
                  <span className="inline-block w-32 border-b border-slate-400" />
                </span>
              </div>

              <p className="text-2xl leading-relaxed font-medium mb-8">
                {q.question}
              </p>

              <ul className="space-y-4 text-xl mb-10">
                {q.options.map((opt, oi) => (
                  <li key={oi} className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className="shrink-0 w-8 h-8 rounded-full border-2 border-slate-400 flex items-center justify-center text-base font-bold"
                    >
                      {LETTERS[oi]}
                    </span>
                    <span>{opt}</span>
                  </li>
                ))}
              </ul>

              <p className="text-sm font-semibold text-slate-500 mb-2">
                Show your work:
              </p>
              <div aria-hidden className="space-y-7">
                <div className="border-b border-dashed border-slate-300" />
                <div className="border-b border-dashed border-slate-300" />
                <div className="border-b border-dashed border-slate-300" />
                <div className="border-b border-dashed border-slate-300" />
              </div>

              <SheetFooter />
            </section>
          ))}

          {/* ── Answer key ── */}
          <section className="ft-sheet rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-card shadow-sm p-6 sm:p-10 mb-8 text-slate-900 dark:text-slate-100">
            <div className="border-b-2 border-slate-800 dark:border-slate-200 pb-3 mb-6">
              <p className="text-sm font-black uppercase tracking-widest">
                Answer Key &amp; Explanations
              </p>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1">
                For teachers &amp; grown-ups — no peeking until Friday, kids! 🙈
              </p>
            </div>

            <ol className="space-y-6">
              {questions.map((q, i) => (
                <li key={q.id}>
                  <p className="font-bold">
                    Day {i + 1} ({DAY_NAMES[i]}) — {q.category} · {q.points}{' '}
                    points
                  </p>
                  <p className="mt-1">
                    Answer:{' '}
                    <strong>
                      {LETTERS[q.answer]} — {q.options[q.answer]}
                    </strong>
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                    {q.explanation}
                  </p>
                </li>
              ))}
            </ol>

            <p className="text-sm text-slate-500 leading-relaxed mt-8">
              Friday discussion tip: for each problem, ask a student who solved
              it a different way to show theirs. Most of these have two or three
              good paths — that conversation is where the learning sticks.
            </p>

            <SheetFooter />
          </section>

          {/* ── Class poster ── */}
          <section className="ft-sheet rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-card shadow-sm p-6 sm:p-10 text-slate-900 dark:text-slate-100">
            <div className="text-center mb-6">
              <p className="text-3xl font-black">
                ⭐ Our 5-Day Math Challenge Stars ⭐
              </p>
              <p className="text-sm text-slate-500 mt-2">
                Color in a star for every day you give the problem a real try.
                Five stars = Challenge Champion!
              </p>
            </div>

            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border border-slate-400 p-2 text-left w-2/5">
                    Name
                  </th>
                  {DAY_NAMES.map((d, i) => (
                    <th key={d} className="border border-slate-400 p-2">
                      Day {i + 1}
                      <span className="block text-[10px] font-normal text-slate-500">
                        {d.slice(0, 3)}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 15 }).map((_, row) => (
                  <tr key={row}>
                    <td className="border border-slate-300 h-10" />
                    {DAY_NAMES.map((d) => (
                      <td
                        key={d}
                        className="border border-slate-300 h-10 text-center text-xl text-slate-300"
                      >
                        ☆
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            <SheetFooter />
          </section>
        </div>

        {/* ── Screen-only footer ── */}
        <div className="ft-no-print text-center mt-4 pb-8 space-y-3">
          <p className="text-sm text-muted-foreground">
            Want the kids to practice on screens too? The same problems are in
            our free interactive practice:{' '}
            <Link href="/tools/kangaroo/" className="font-semibold underline underline-offset-2">
              Math Kangaroo Prep →
            </Link>
          </p>
          <p className="text-xs text-muted-foreground/60 max-w-xl mx-auto leading-relaxed">
            All problems in this pack are original, written in the Math
            Kangaroo style. Not affiliated with Math Kangaroo USA or any
            school district.
          </p>
        </div>
      </div>
    </article>
  );
}
