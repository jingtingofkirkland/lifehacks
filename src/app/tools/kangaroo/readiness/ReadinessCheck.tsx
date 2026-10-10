'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { trackEvent } from '@/lib/pixel';
import { UsefulnessFeedback } from '@/components/UsefulnessFeedback';
import {
  READINESS_GAME,
  buildPracticePlan,
  readinessQuestions,
  recommendedPractice,
  summarizeTopics,
  topicVerdict,
} from '../readiness';

const TOTAL_POINTS = 36;
const UNLOCK_KEY = 'kangaroo-readiness-report-unlocked';

const VERDICT_STYLE: Record<
  ReturnType<typeof topicVerdict>,
  { label: string; chip: string; bar: string }
> = {
  strong: {
    label: 'Strong 💪',
    chip: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
    bar: 'bg-emerald-500',
  },
  growing: {
    label: 'Growing 🌱',
    chip: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
    bar: 'bg-amber-500',
  },
  focus: {
    label: 'Focus next 🎯',
    chip: 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300',
    bar: 'bg-rose-500',
  },
};

export default function ReadinessCheck() {
  const questions = useMemo(readinessQuestions, []);
  const [answers, setAnswers] = useState<(number | null)[]>(
    () => questions.map(() => null),
  );
  const [submitted, setSubmitted] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const startedRef = useRef(false);
  const completedRef = useRef(false);

  useEffect(() => {
    try {
      setUnlocked(window.localStorage.getItem(UNLOCK_KEY) === '1');
    } catch {
      // private mode etc. — report simply stays locked
    }
  }, []);

  const answeredCount = answers.filter((a) => a !== null).length;
  const stats = useMemo(
    () => summarizeTopics(questions, answers),
    [questions, answers],
  );
  const totalPoints = stats.reduce((n, s) => n + s.points, 0);
  const correctCount = stats.reduce((n, s) => n + s.correct, 0);
  const picks = useMemo(() => recommendedPractice(stats), [stats]);
  const plan = useMemo(() => buildPracticePlan(stats), [stats]);

  const pick = (qIdx: number, optIdx: number) => {
    if (submitted) return;
    // GameStarted semantics (2026-10-10): a "start" is the first real
    // answer, not a page view. Same rule as the daily challenge.
    if (!startedRef.current) {
      startedRef.current = true;
      trackEvent('GameStarted', { game: READINESS_GAME });
    }
    setAnswers((prev) => prev.map((a, i) => (i === qIdx ? optIdx : a)));
  };

  const finish = () => {
    if (answeredCount < questions.length || submitted) return;
    setSubmitted(true);
    if (!completedRef.current) {
      completedRef.current = true;
      trackEvent('GameCompleted', {
        game: READINESS_GAME,
        score: totalPoints,
        total: TOTAL_POINTS,
      });
    }
    document
      .getElementById('kr-results')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const unlock = () => {
    setUnlocked(true);
    try {
      window.localStorage.setItem(UNLOCK_KEY, '1');
    } catch {
      // non-fatal: unlocked for this session only
    }
  };

  const retake = () => {
    setAnswers(questions.map(() => null));
    setSubmitted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <article className="min-h-screen bg-gradient-to-b from-violet-50 via-background to-background dark:from-violet-950/20 dark:via-background dark:to-background">
      {/* print stylesheet: only the full report survives printing */}
      <style>{`
        @media print {
          .kr-no-print { display: none !important; }
          .kr-report { border: none !important; box-shadow: none !important; }
          .kr-week { break-inside: avoid; }
        }
      `}</style>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="kr-no-print">
          <Link
            href="/tools/kangaroo/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform"><path d="M15 18l-6-6 6-6"/></svg>
            Back to Kangaroo Prep
          </Link>

          <div className="mt-8 mb-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-violet-400/60" />
              <span className="text-violet-500 dark:text-violet-400 text-2xl">🧭</span>
              <span className="h-px w-12 bg-gradient-to-l from-transparent to-violet-400/60" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-violet-700 via-purple-600 to-fuchsia-600 dark:from-violet-400 dark:via-purple-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
              Kangaroo Readiness Check
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
              Nine quick Kangaroo-style questions for grades 3–4. Answer them
              together, then see exactly which topics are strong and which to
              practice next.
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300">
                9 questions · about 5 minutes
              </span>
              <span className="text-xs text-muted-foreground">
                Not a contest score — a practice compass
              </span>
            </div>
          </div>

          {/* progress */}
          <div className="mb-6" aria-live="polite">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>
                {submitted
                  ? 'Check complete 🎉'
                  : `${answeredCount} of ${questions.length} answered`}
              </span>
              <span>{Math.round((answeredCount / questions.length) * 100)}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div
                className="h-full bg-violet-500 transition-all"
                style={{ width: `${(answeredCount / questions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* questions */}
        <div className="space-y-6">
          {questions.map((q, qIdx) => {
            const picked = answers[qIdx];
            return (
              <section
                key={q.id}
                data-testid={`kr-question-${q.id}`}
                className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-card/70 p-5"
              >
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-xs font-bold text-muted-foreground">
                    Q{qIdx + 1}
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300">
                    {q.points} pts
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {q.category}
                  </span>
                </div>
                <p className="text-lg font-medium mb-4">{q.question}</p>
                <div className="grid gap-2" role="group" aria-label={`Answers for question ${qIdx + 1}`}>
                  {q.options.map((opt, optIdx) => {
                    const isPicked = picked === optIdx;
                    const isAnswer = q.answer === optIdx;
                    let cls =
                      'border-slate-200 dark:border-slate-700 hover:border-violet-400';
                    if (submitted) {
                      if (isAnswer)
                        cls = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40';
                      else if (isPicked)
                        cls = 'border-rose-400 bg-rose-50 dark:bg-rose-950/40';
                      else cls = 'border-slate-200 dark:border-slate-700 opacity-70';
                    } else if (isPicked) {
                      cls = 'border-violet-500 bg-violet-50 dark:bg-violet-950/40';
                    }
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        disabled={submitted}
                        onClick={() => pick(qIdx, optIdx)}
                        aria-pressed={isPicked}
                        className={`flex items-center gap-3 text-left px-4 py-3 rounded-xl border-2 transition-all ${cls}`}
                      >
                        <span className="text-xs font-bold w-5 h-5 shrink-0 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="font-medium">{opt}</span>
                        {submitted && isAnswer && <span aria-hidden>✅</span>}
                        {submitted && isPicked && !isAnswer && <span aria-hidden>❌</span>}
                      </button>
                    );
                  })}
                </div>
                {submitted && (
                  <div
                    className={`mt-4 rounded-xl px-4 py-3 text-sm leading-relaxed ${
                      picked === q.answer
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200'
                        : 'bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200'
                    }`}
                  >
                    <p className="font-bold mb-1">
                      {picked === q.answer
                        ? 'Correct! 🎉'
                        : `Not quite — the answer is ${String.fromCharCode(65 + q.answer)} (${q.options[q.answer]}).`}
                    </p>
                    <p>{q.explanation}</p>
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {/* finish */}
        {!submitted && (
          <div className="kr-no-print mt-8 text-center">
            <button
              type="button"
              data-testid="kr-finish"
              onClick={finish}
              disabled={answeredCount < questions.length}
              className="px-8 py-3 rounded-full bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-lg shadow-lg transition-all"
            >
              {answeredCount < questions.length
                ? `Answer ${questions.length - answeredCount} more to see results`
                : 'See my results →'}
            </button>
          </div>
        )}

        {/* results */}
        {submitted && (
          <div id="kr-results" data-testid="kr-results" className="mt-10">
            <div className="kr-no-print rounded-2xl border border-violet-200/70 dark:border-violet-800/40 bg-violet-50/60 dark:bg-violet-950/20 p-6 text-center mb-6">
              <p className="text-sm text-muted-foreground mb-1">
                Readiness score
              </p>
              <p className="text-4xl font-extrabold mb-1">
                {correctCount} / {questions.length} correct · {totalPoints} /{' '}
                {TOTAL_POINTS} points
              </p>
              <p className="text-sm text-muted-foreground">
                {correctCount >= 8
                  ? 'Contest-ready form — keep it sharp with timed practice.'
                  : correctCount >= 5
                    ? 'A solid base. A few focused topics will lift this fast.'
                    : 'Great starting point — the plan below shows exactly where to begin.'}
              </p>
            </div>

            {/* topic strength bars */}
            <div className="kr-no-print rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-card/70 p-6 mb-6">
              <h2 className="font-bold text-lg mb-4">Topic strengths</h2>
              <div className="space-y-4">
                {stats.map((s) => {
                  const v = VERDICT_STYLE[topicVerdict(s)];
                  const pct = s.total ? Math.round((s.correct / s.total) * 100) : 0;
                  return (
                    <div key={s.category} data-testid={`kr-topic-${s.category}`}>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-semibold text-sm">{s.category}</span>
                        <span className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {s.correct}/{s.total} correct
                          </span>
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${v.chip}`}>
                            {v.label}
                          </span>
                        </span>
                      </div>
                      <div className="h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div
                          className={`h-full ${v.bar} transition-all`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* recommended practice path */}
            <div className="kr-no-print rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-card/70 p-6 mb-6">
              <h2 className="font-bold text-lg mb-2">Your practice path</h2>
              {picks.length === 0 ? (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Every topic came back strong 🎉 — move on to the{' '}
                  <Link href="/tools/kangaroo/" className="text-violet-700 dark:text-violet-300 font-semibold hover:underline">
                    timed quiz
                  </Link>{' '}
                  and try to beat the clock.
                </p>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mb-4">
                    Weakest topics first — each link opens a fresh problem with
                    a full explanation:
                  </p>
                  <div className="space-y-4">
                    {picks.map((pick) => (
                      <div key={pick.category}>
                        <p className="font-semibold text-sm mb-2">
                          Practice {pick.category} next:
                        </p>
                        <ul className="grid gap-2">
                          {pick.problems.map((p) => (
                            <li key={p.question.id}>
                              <Link
                                href={p.path}
                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-violet-400 hover:bg-violet-50/60 dark:hover:bg-violet-950/30 transition-all"
                              >
                                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300 shrink-0">
                                  {p.question.points} pts
                                </span>
                                <span className="font-medium text-sm">{p.title}</span>
                                <span className="ml-auto text-violet-500" aria-hidden>→</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </>
              )}
              <div className="flex flex-wrap gap-3 mt-5">
                <Link
                  href="/tools/kangaroo/"
                  className="px-5 py-2.5 rounded-full bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700"
                >
                  Daily challenge + timed quiz →
                </Link>
                <Link
                  href={correctCount >= 5 ? '/practice/kangaroo/grade-4/' : '/practice/kangaroo/grade-3/'}
                  className="px-5 py-2.5 rounded-full border border-violet-300 dark:border-violet-700 text-sm font-semibold hover:bg-violet-100 dark:hover:bg-violet-900/40"
                >
                  Browse the problem library →
                </Link>
              </div>
            </div>

            {/* full report gate */}
            {!unlocked ? (
              <div
                data-testid="kr-report-gate"
                className="kr-no-print rounded-2xl border border-emerald-200/70 dark:border-emerald-800/40 bg-emerald-50/60 dark:bg-emerald-950/20 p-6 text-center mb-6"
              >
                <p className="font-bold text-lg mb-1">
                  📄 Your full printable report is one step away
                </p>
                <p className="text-sm text-muted-foreground mb-4 max-w-lg mx-auto leading-relaxed">
                  The full report adds a question-by-question review and a
                  personal 4-week practice plan you can print for the fridge.
                  It comes with our free weekly worksheet — subscribe, then
                  unlock it here.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Link
                    href="/newsletter/"
                    data-testid="kr-subscribe"
                    className="px-6 py-2.5 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
                  >
                    Subscribe free to unlock →
                  </Link>
                  <button
                    type="button"
                    data-testid="kr-unlock"
                    onClick={unlock}
                    className="px-6 py-2.5 rounded-full border border-emerald-300 dark:border-emerald-700 font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/40"
                  >
                    I subscribed — show my report
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-6">
                <div className="kr-no-print flex flex-wrap items-center justify-between gap-3 mb-4">
                  <h2 className="font-bold text-lg">📄 Full readiness report</h2>
                  <button
                    type="button"
                    data-testid="kr-print"
                    onClick={() => window.print()}
                    className="px-5 py-2 rounded-full bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700"
                  >
                    🖨️ Print my report
                  </button>
                </div>

                <div className="kr-report rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-card p-6">
                  <h3 className="text-xl font-bold mb-1">
                    Kangaroo Readiness Report — Grades 3–4
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Score: {correctCount}/{questions.length} correct ·{' '}
                    {totalPoints}/{TOTAL_POINTS} Kangaroo-style points ·
                    Great Seattle Life Hacks
                  </p>

                  <h4 className="font-bold mb-2">Topic strengths</h4>
                  <ul className="text-sm space-y-1 mb-5">
                    {stats.map((s) => (
                      <li key={s.category}>
                        <strong>{s.category}:</strong> {s.correct}/{s.total}{' '}
                        correct ({s.points}/{s.maxPoints} pts) —{' '}
                        {VERDICT_STYLE[topicVerdict(s)].label}
                      </li>
                    ))}
                  </ul>

                  <h4 className="font-bold mb-2">Your 4-week practice plan</h4>
                  <div className="space-y-4 mb-5">
                    {plan.map((week) => (
                      <div key={week.week} className="kr-week">
                        <p className="font-semibold text-sm">
                          Week {week.week}: {week.title}
                        </p>
                        <p className="text-sm text-muted-foreground mb-1">
                          {week.focus}
                        </p>
                        <ul className="list-disc pl-5 text-sm space-y-0.5">
                          {week.tasks.map((t) => (
                            <li key={t}>{t}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <h4 className="font-bold mb-2">Question review</h4>
                  <ol className="list-decimal pl-5 text-sm space-y-2">
                    {questions.map((q, i) => (
                      <li key={q.id}>
                        <strong>
                          {pickedLabel(answers[i], q)} [{q.category}, {q.points}{' '}
                          pts]
                        </strong>{' '}
                        {q.question}{' '}
                        <span className="text-muted-foreground">
                          Answer: {q.options[q.answer]}. {q.explanation}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}

            <div className="kr-no-print text-center mb-6">
              <button
                type="button"
                data-testid="kr-retake"
                onClick={retake}
                className="px-6 py-2.5 rounded-full border border-slate-300 dark:border-slate-600 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ↻ Retake the check
              </button>
            </div>
          </div>
        )}

        <div className="kr-no-print mt-10 mb-6">
          <UsefulnessFeedback
            page="tools-kangaroo-readiness"
            prompt="Was this readiness check helpful?"
            helper="One click helps us build more free contest prep you'll actually use."
          />
        </div>

        <div className="kr-no-print text-center pb-8 space-y-2">
          <p className="text-xs text-muted-foreground/70 max-w-xl mx-auto leading-relaxed">
            All practice problems are written by us, inspired by the Math
            Kangaroo style. We are not affiliated with or endorsed by Math
            Kangaroo, and these are not past contest questions.
          </p>
          <p className="text-xs text-muted-foreground/50">
            Answers stay in this browser only. No data collected. Runs
            entirely on your device.
          </p>
        </div>
      </div>
    </article>
  );
}

function pickedLabel(
  picked: number | null,
  q: { answer: number; options: string[] },
): string {
  if (picked === null) return 'Skipped.';
  return picked === q.answer
    ? `Correct (${q.options[picked]}).`
    : `Your answer: ${q.options[picked]}.`;
}
