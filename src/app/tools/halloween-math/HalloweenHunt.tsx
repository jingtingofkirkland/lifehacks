'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { SubscribeCta } from '@/components/SubscribeCta';
import { trackEvent } from '@/lib/pixel';
import type { KangarooQuestion } from '../kangaroo/questions';
import {
  getOnlineQuestions,
  HALLOWEEN_EMOJI,
  HALLOWEEN_QUESTIONS,
  scoreHunt,
} from './questions';

const LETTERS = ['A', 'B', 'C', 'D', 'E'];
const GAME = 'halloween_math';

/* ═══════════════ Online hunt (6 problems) ═══════════════ */

function OnlineHunt() {
  const questions = useMemo(() => getOnlineQuestions(), []);
  const [picks, setPicks] = useState<Record<string, number>>({});
  const startedRef = useRef(false);
  const completedRef = useRef(false);

  const answered = questions.filter((q) => picks[q.id] !== undefined).length;
  const allDone = answered === questions.length;
  const score = useMemo(() => scoreHunt(questions, picks), [questions, picks]);

  const answer = (q: KangarooQuestion, idx: number) => {
    if (picks[q.id] !== undefined) return;
    // Same event semantics as the Kangaroo daily challenge (2026-10-10):
    // "started" fires on the first actual answer, not on page open.
    if (!startedRef.current) {
      startedRef.current = true;
      trackEvent('GameStarted', { game: GAME });
    }
    const next = { ...picks, [q.id]: idx };
    setPicks(next);
    if (
      !completedRef.current &&
      questions.every((qq) => next[qq.id] !== undefined)
    ) {
      completedRef.current = true;
      const s = scoreHunt(questions, next);
      trackEvent('GameCompleted', {
        game: GAME,
        score: s.earned,
        total: s.possible,
      });
    }
  };

  return (
    <section aria-label="Play the Halloween Math Hunt online">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">🎃 Play online: 6 problems</h2>
        <span className="text-sm text-muted-foreground">
          {answered} of {questions.length} solved
        </span>
      </div>

      <div className="grid gap-5">
        {questions.map((q, qi) => {
          const picked = picks[q.id];
          return (
            <div
              key={q.id}
              data-testid={`hw-question-${q.id}`}
              className="rounded-2xl border border-orange-200/80 dark:border-orange-800/40 bg-white/80 dark:bg-card/80 p-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300">
                  {q.points} points
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {q.category}
                </span>
                <span className="text-xs text-muted-foreground">
                  Problem {qi + 1} of {questions.length}
                </span>
              </div>
              <p className="text-lg leading-relaxed mb-5">
                {HALLOWEEN_EMOJI[q.id]} {q.question}
              </p>

              <div className="grid gap-2" role="group" aria-label="Answer choices">
                {q.options.map((opt, i) => {
                  const isAnswer = i === q.answer;
                  const isPicked = picked === i;
                  let cls =
                    'border-slate-200 dark:border-slate-700 hover:border-orange-400 hover:bg-orange-50/60 dark:hover:bg-orange-950/30';
                  if (picked !== undefined) {
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
                      disabled={picked !== undefined}
                      onClick={() => answer(q, i)}
                      aria-pressed={isPicked}
                      className={`flex items-center gap-3 text-left px-4 py-3 rounded-xl border-2 transition-all ${cls} disabled:cursor-default`}
                    >
                      <span className="shrink-0 w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm font-bold">
                        {LETTERS[i]}
                      </span>
                      <span>{opt}</span>
                      {picked !== undefined && isAnswer && (
                        <span className="ml-auto text-emerald-600 text-xl" aria-hidden>
                          ✓
                        </span>
                      )}
                      {picked !== undefined && isPicked && !isAnswer && (
                        <span className="ml-auto text-red-500 text-xl" aria-hidden>
                          ✗
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {picked !== undefined && (
                <div className="mt-5 p-4 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800">
                  <p className="font-semibold mb-1">
                    {picked === q.answer
                      ? '🎉 Correct! Nice work.'
                      : `Not quite — the answer is ${LETTERS[q.answer]}.`}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {q.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {allDone && (
        <div
          data-testid="hw-hunt-score"
          className="mt-6 rounded-2xl border border-orange-300/80 dark:border-orange-700/60 bg-gradient-to-br from-orange-100/80 to-amber-100/60 dark:from-orange-950/40 dark:to-amber-950/30 p-6 text-center"
        >
          <p className="font-bold text-lg mb-1">
            🏆 Hunt complete — you scored {score.earned} of {score.possible}{' '}
            points!
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            You solved {score.correctCount} of {questions.length} online
            problems. The full hunt has 6 more print-only problems waiting in
            the pack below.
          </p>
          <a
            href="#print-pack"
            className="inline-block px-6 py-2.5 rounded-full bg-orange-600 text-white font-semibold hover:bg-orange-700"
          >
            🖨 Get the full 12-problem pack
          </a>
        </div>
      )}
    </section>
  );
}

/* ═══════════════ Printable pack (all 12 problems) ═══════════════ */

function SheetHeader() {
  return (
    <div className="flex items-baseline justify-between border-b-2 border-slate-300 pb-2 mb-5">
      <span className="font-black text-lg">Halloween Math Hunt — Grades 3–4</span>
      <span className="text-xs text-slate-500">lifehacks.zeey-app.net</span>
    </div>
  );
}

function SheetFooter() {
  return (
    <p className="mt-6 pt-2 border-t border-slate-200 text-[11px] text-slate-400 text-center">
      Free from Great Seattle Life Hacks — new problems every Friday
    </p>
  );
}

function PrintQuestion({ q, n }: { q: KangarooQuestion; n: number }) {
  return (
    <li className="hw-pack-item">
      <p className="font-medium">
        {n}.{' '}
        <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
          ({q.points} pts)
        </span>{' '}
        {HALLOWEEN_EMOJI[q.id]} {q.question}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 mt-1.5 ml-1 text-sm">
        {q.options.map((opt, oi) => (
          <span key={oi}>
            ☐ {LETTERS[oi]}. {opt}
          </span>
        ))}
      </div>
      <div className="mt-2 ml-1 h-9 border-b border-dotted border-slate-300" />
    </li>
  );
}

function PrintablePack() {
  const pages: KangarooQuestion[][] = [
    HALLOWEEN_QUESTIONS.slice(0, 4),
    HALLOWEEN_QUESTIONS.slice(4, 8),
    HALLOWEEN_QUESTIONS.slice(8, 12),
  ];

  const print = () => {
    trackEvent('WorksheetPrinted', { game: GAME });
    window.print();
  };

  return (
    <section id="print-pack" aria-label="Printable Halloween Math Hunt pack">
      <div className="hw-no-print flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-xl font-bold">🖨 The full hunt — all 12 problems</h2>
        <button
          type="button"
          onClick={print}
          data-testid="hw-print"
          className="px-6 py-2.5 rounded-full bg-orange-600 hover:bg-orange-700 text-white font-semibold shadow transition-all hover:-translate-y-0.5"
        >
          🖨 Print the full pack
        </button>
      </div>
      <p className="hw-no-print text-sm text-muted-foreground mb-4">
        Print the whole treasure hunt for the kitchen table: 12 problems on 3
        pages, plus an answer key on its own page.{' '}
        <strong>6 bonus problems are print-only</strong> — they are not in the
        online hunt above.
      </p>

      {pages.map((pageQs, pi) => (
        <div
          key={pi}
          className="hw-sheet rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-card p-6 sm:p-8 text-slate-900 dark:text-slate-100 mb-6"
        >
          <SheetHeader />
          {pi === 0 && (
            <div className="flex justify-between text-sm mb-5">
              <span>
                Name: <span className="inline-block w-40 border-b border-slate-400" />
              </span>
              <span>Date: ____________</span>
            </div>
          )}
          <ol className="space-y-5">
            {pageQs.map((q, i) => (
              <PrintQuestion key={q.id} q={q} n={pi * 4 + i + 1} />
            ))}
          </ol>
          <SheetFooter />
        </div>
      ))}

      {/* answer key — always its own printed page */}
      <div className="hw-sheet hw-answer-key rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-card p-6 sm:p-8 text-slate-900 dark:text-slate-100">
        <SheetHeader />
        <h3 className="font-black text-lg mb-1">Answer Key</h3>
        <p className="text-xs text-slate-500 mb-4">
          For parents and teachers — no peeking, kids! 🙈
        </p>
        <ol className="space-y-2.5 text-sm">
          {HALLOWEEN_QUESTIONS.map((q, i) => (
            <li key={q.id}>
              <strong>
                {i + 1}. {LETTERS[q.answer]}
              </strong>{' '}
              — {q.explanation}
            </li>
          ))}
        </ol>

        <div className="mt-8 space-y-3 border-t-2 border-slate-300 pt-5 text-sm leading-relaxed">
          <p>
            📬 <strong>Get the Weekly Worksheet — 3 new problems every Friday, free:</strong>{' '}
            lifehacks.zeey-app.net/newsletter/
          </p>
          <p>
            🧭 Want to know your child&apos;s Kangaroo readiness? Take the free
            9-question check: lifehacks.zeey-app.net/tools/kangaroo/readiness/
          </p>
          <p>
            🎃 Free pumpkin carving stencils: lifehacks.zeey-app.net/halloween/pumpkin-stencils/
          </p>
        </div>
        <SheetFooter />
      </div>
    </section>
  );
}

/* ═══════════════ Page body ═══════════════ */

export function HalloweenHunt() {
  return (
    <article className="min-h-screen bg-gradient-to-b from-orange-50 via-background to-background dark:from-orange-950/20 dark:via-background dark:to-background">
      {/* print stylesheet: only the pack sheets survive printing */}
      <style>{`
        @media print {
          .hw-no-print { display: none !important; }
          .hw-sheet {
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            margin: 0 !important;
            break-after: page;
          }
          .hw-sheet:last-child { break-after: auto; }
        }
      `}</style>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="hw-no-print">
          <Link
            href="/tools/education"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform"><path d="M15 18l-6-6 6-6"/></svg>
            Back to Education
          </Link>

          <div className="mt-8 mb-8 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element -- decorative stencil SVGs, fixed intrinsic size */}
            <img
              src="/halloween/bat.svg"
              alt=""
              aria-hidden
              className="w-24 h-24 mx-auto mb-3 dark:invert"
            />
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-700 via-amber-600 to-orange-500 dark:from-orange-400 dark:via-amber-400 dark:to-orange-300 bg-clip-text text-transparent">
              Halloween Math Hunt
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
              12 spooky-but-friendly Kangaroo-style problems for grades 3–4.
              Play 6 online, then print the full hunt — all 12 — for the
              kitchen table.
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300">
                Grades 3–4
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300">
                🎃 Halloween special
              </span>
            </div>
            <a
              href="#print-pack"
              className="inline-block mt-5 px-6 py-2.5 rounded-full bg-orange-600 text-white font-semibold hover:bg-orange-700"
            >
              🖨 Print the full pack
            </a>
          </div>

          <div className="mb-10">
            <OnlineHunt />
          </div>
        </div>

        <PrintablePack />

        <div className="hw-no-print">
          {/* Newsletter CTA: shared subscribe card (Top 2) */}
          <div className="mt-8">
            <SubscribeCta />
          </div>

          {/* Cross-links: stencils, readiness check, Kangaroo hub */}
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Link
              href="/halloween/pumpkin-stencils/"
              data-testid="hw-link-stencils"
              className="rounded-2xl border border-orange-200/70 dark:border-orange-800/40 bg-orange-50/60 dark:bg-orange-950/20 p-5 text-center hover:border-orange-400 transition-colors"
            >
              <p className="font-bold mb-1">🎃 Carving break?</p>
              <p className="text-sm text-muted-foreground">
                Free printable pumpkin stencils — spot the spider and the bat
                from the stencils hiding in these puzzles.
              </p>
            </Link>
            <Link
              href="/tools/kangaroo/readiness/"
              data-testid="hw-link-readiness"
              className="rounded-2xl border border-violet-200/70 dark:border-violet-800/40 bg-violet-50/60 dark:bg-violet-950/20 p-5 text-center hover:border-violet-400 transition-colors"
            >
              <p className="font-bold mb-1">🧭 Kangaroo Readiness Check</p>
              <p className="text-sm text-muted-foreground">
                Nine quick questions show where your child stands and what to
                practice next.
              </p>
            </Link>
            <Link
              href="/tools/kangaroo/"
              data-testid="hw-link-kangaroo"
              className="rounded-2xl border border-emerald-200/70 dark:border-emerald-800/40 bg-emerald-50/60 dark:bg-emerald-950/20 p-5 text-center hover:border-emerald-400 transition-colors"
            >
              <p className="font-bold mb-1">🦘 Kangaroo Prep Hub</p>
              <p className="text-sm text-muted-foreground">
                A daily challenge, timed quizzes and printable worksheets —
                free all year.
              </p>
            </Link>
          </div>

          <div className="text-center pb-8 mt-10">
            <p className="text-xs text-muted-foreground/70 max-w-xl mx-auto leading-relaxed">
              All problems are original, written by us in the spirit of Math
              Kangaroo. We are not affiliated with or endorsed by Math
              Kangaroo, and these are not past contest questions.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
