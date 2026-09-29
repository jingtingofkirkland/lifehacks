'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { UsefulnessFeedback } from '@/components/UsefulnessFeedback';
import { trackEvent } from '@/lib/pixel';
import {
  dayNumber,
  getDailyQuestion,
  getQuizQuestions,
  scoreQuiz,
  type KangarooQuestion,
} from './questions';

type Tab = 'daily' | 'quiz' | 'worksheet';

const LETTERS = ['A', 'B', 'C', 'D', 'E'];
const QUIZ_SECONDS = 12 * 60;
const QUIZ_COUNT = 8;
const WORKSHEET_COUNT = 12;

/* ── tiny localStorage helpers (never throw, never run on the server) ── */
function readJSON(key: string): unknown {
  try {
    if (typeof window === 'undefined') return null;
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeJSON(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode etc. — the feature works without persistence */
  }
}

function utcDateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function fmtTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/* ═══════════════ Daily Challenge ═══════════════ */
function DailyChallenge({ today }: { today: Date }) {
  const q = useMemo(
    () => getDailyQuestion('grades-3-4', today),
    // today is stable for the session; recompute only if the day changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [utcDateKey(today)],
  );
  const [picked, setPicked] = useState<number | null>(null);
  const [streak, setStreak] = useState<number>(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!startedRef.current) {
      startedRef.current = true;
      trackEvent('GameStarted', { game: 'kangaroo_daily' });
    }
    const s = readJSON('kq-streak') as { last?: string; count?: number } | null;
    setStreak(typeof s?.count === 'number' ? s.count : 0);
  }, []);

  const answer = (idx: number) => {
    if (picked !== null) return;
    setPicked(idx);
    const correct = idx === q.answer;
    trackEvent('GameCompleted', { game: 'kangaroo_daily', correct });

    // Streak: one count per UTC day answered.
    const key = utcDateKey(today);
    const s = readJSON('kq-streak') as { last?: string; count?: number } | null;
    if (s?.last !== key) {
      const yesterday = utcDateKey(new Date(today.getTime() - 86_400_000));
      const next = s?.last === yesterday ? (s.count ?? 0) + 1 : 1;
      writeJSON('kq-streak', { last: key, count: next });
      setStreak(next);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Today&apos;s Challenge</h2>
        {streak > 0 && (
          <span
            className="text-sm font-semibold px-3 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300"
            title="Consecutive days you solved the daily challenge"
          >
            🔥 {streak}-day streak
          </span>
        )}
      </div>

      <div className="rounded-2xl border border-emerald-200/80 dark:border-emerald-800/40 bg-white/80 dark:bg-card/80 p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300">
            {q.points} points
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {q.category}
          </span>
        </div>
        <p className="text-lg leading-relaxed mb-5">{q.question}</p>

        <div className="grid gap-2" role="group" aria-label="Answer choices">
          {q.options.map((opt, i) => {
            const isAnswer = i === q.answer;
            const isPicked = picked === i;
            let cls =
              'border-slate-200 dark:border-slate-700 hover:border-emerald-400 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/30';
            if (picked !== null) {
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
                disabled={picked !== null}
                onClick={() => answer(i)}
                aria-pressed={isPicked}
                className={`flex items-center gap-3 text-left px-4 py-3 rounded-xl border-2 transition-all ${cls} disabled:cursor-default`}
              >
                <span className="shrink-0 w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm font-bold">
                  {LETTERS[i]}
                </span>
                <span>{opt}</span>
                {picked !== null && isAnswer && (
                  <span className="ml-auto text-emerald-600 text-xl" aria-hidden>
                    ✓
                  </span>
                )}
                {picked !== null && isPicked && !isAnswer && (
                  <span className="ml-auto text-red-500 text-xl" aria-hidden>
                    ✗
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {picked !== null && (
          <div className="mt-5 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
            <p className="font-semibold mb-1">
              {picked === q.answer
                ? '🎉 Correct! Nice work.'
                : `Not quite — the answer is ${LETTERS[q.answer]}.`}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {q.explanation}
            </p>
            <p className="text-xs text-muted-foreground/70 mt-3">
              Come back tomorrow for a new challenge — a fresh problem every
              day.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════ Timed Quiz ═══════════════ */
type QuizPhase = 'intro' | 'running' | 'done';

function TimedQuiz({ today }: { today: Date }) {
  const [phase, setPhase] = useState<QuizPhase>('intro');
  const [questions, setQuestions] = useState<KangarooQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(QUIZ_SECONDS);
  const [best, setBest] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const b = readJSON('kq-best');
    if (typeof b === 'number') setBest(b);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const start = (seed?: number) => {
    const qs = getQuizQuestions('grades-3-4', QUIZ_COUNT, seed, today);
    setQuestions(qs);
    setAnswers(new Array(qs.length).fill(null));
    setIndex(0);
    setPicked(null);
    setSecondsLeft(QUIZ_SECONDS);
    setPhase('running');
    trackEvent('GameStarted', { game: 'kangaroo_quiz' });
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          finishRef.current();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const finish = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const { earned, possible } = scoreQuiz(questions, answers);
    trackEvent('GameCompleted', {
      game: 'kangaroo_quiz',
      score: earned,
      total: possible,
    });
    const b = readJSON('kq-best');
    if (typeof b !== 'number' || earned > b) {
      writeJSON('kq-best', earned);
      setBest(earned);
    }
    setPhase('done');
  };
  const finishRef = useRef(finish);
  finishRef.current = finish;

  const choose = (optIdx: number) => {
    if (picked !== null || phase !== 'running') return;
    const q = questions[index];
    const next = [...answers];
    next[index] = optIdx;
    setAnswers(next);
    setPicked(optIdx);
    // Brief pause so the kid sees right/wrong, then auto-advance.
    setTimeout(() => {
      if (index + 1 >= questions.length) {
        finishRef.current();
      } else {
        setIndex(index + 1);
        setPicked(null);
      }
    }, 450);
  };

  if (phase === 'intro') {
    return (
      <div className="rounded-2xl border border-emerald-200/80 dark:border-emerald-800/40 bg-white/80 dark:bg-card/80 p-6 text-center">
        <h2 className="text-xl font-bold mb-2">Timed Practice Quiz</h2>
        <p className="text-muted-foreground mb-4 max-w-md mx-auto">
          {QUIZ_COUNT} Kangaroo-style questions in {QUIZ_SECONDS / 60} minutes —
          just like the real contest, harder questions are worth more points
          (3, 4 or 5 each).
        </p>
        {best !== null && (
          <p className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-4">
            🏆 Your best score: {best} points
          </p>
        )}
        <button
          type="button"
          onClick={() => start()}
          data-testid="kq-quiz-start"
          className="px-8 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg shadow-lg transition-all hover:-translate-y-0.5"
        >
          Start Quiz
        </button>
      </div>
    );
  }

  if (phase === 'done') {
    const { earned, possible, correctCount } = scoreQuiz(questions, answers);
    return (
      <div>
        <div className="rounded-2xl border border-emerald-200/80 dark:border-emerald-800/40 bg-white/80 dark:bg-card/80 p-6 text-center mb-6">
          <h2 className="text-xl font-bold mb-1">Quiz complete!</h2>
          <p className="text-5xl font-black text-emerald-600 dark:text-emerald-400 my-3">
            {earned}
            <span className="text-2xl text-muted-foreground font-bold">
              /{possible}
            </span>
          </p>
          <p className="text-muted-foreground">
            {correctCount} of {questions.length} correct
            {earned === possible
              ? ' — a perfect score! 🦘'
              : correctCount >= questions.length - 2
                ? ' — so close!'
                : ' — keep practicing!'}
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-5">
            <button
              type="button"
              onClick={() => start(Date.now() % 1_000_000_000)}
              className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors"
            >
              Try a new quiz
            </button>
            <button
              type="button"
              onClick={() => setPhase('intro')}
              className="px-6 py-2.5 rounded-full border border-slate-300 dark:border-slate-600 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Back
            </button>
          </div>
        </div>

        <h3 className="font-bold text-lg mb-3">Review with explanations</h3>
        <div className="grid gap-3" data-testid="kq-quiz-review">
          {questions.map((q, i) => {
            const ok = answers[i] === q.answer;
            return (
              <div
                key={q.id}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-card/70 p-4"
              >
                <p className="font-medium mb-2">
                  <span className="mr-2">{ok ? '✅' : '❌'}</span>
                  {i + 1}. {q.question}
                </p>
                <p className="text-sm mb-1">
                  Your answer:{' '}
                  <strong>
                    {answers[i] === null
                      ? '— (time ran out)'
                      : `${LETTERS[answers[i] as number]}. ${q.options[answers[i] as number]}`}
                  </strong>
                  {!ok && (
                    <>
                      {' '}
                      · Correct:{' '}
                      <strong className="text-emerald-600">
                        {LETTERS[q.answer]}. {q.options[q.answer]}
                      </strong>
                    </>
                  )}
                </p>
                <p className="text-sm text-muted-foreground">{q.explanation}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const q = questions[index];
  if (!q) return null;
  const urgent = secondsLeft <= 120;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-muted-foreground">
          Question {index + 1} of {questions.length}
        </span>
        <span
          className={`text-lg font-black tabular-nums px-3 py-1 rounded-full ${
            urgent
              ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
          }`}
          role="timer"
          aria-live="polite"
          aria-label={`${fmtTime(secondsLeft)} remaining`}
          data-testid="kq-quiz-timer"
        >
          ⏱ {fmtTime(secondsLeft)}
        </span>
      </div>

      {/* progress bar */}
      <div
        className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 mb-5 overflow-hidden"
        role="progressbar"
        aria-valuenow={index + 1}
        aria-valuemin={1}
        aria-valuemax={questions.length}
      >
        <div
          className="h-full bg-emerald-500 transition-all duration-300"
          style={{ width: `${((index + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div
        className="rounded-2xl border border-emerald-200/80 dark:border-emerald-800/40 bg-white/80 dark:bg-card/80 p-6"
        data-testid="kq-quiz-question"
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300">
            {q.points} points
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {q.category}
          </span>
        </div>
        <p className="text-lg leading-relaxed mb-5">{q.question}</p>
        <div className="grid gap-2" role="group" aria-label="Answer choices">
          {q.options.map((opt, i) => {
            const isAnswer = i === q.answer;
            const isPicked = picked === i;
            let cls =
              'border-slate-200 dark:border-slate-700 hover:border-emerald-400 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/30';
            if (picked !== null) {
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
                disabled={picked !== null}
                onClick={() => choose(i)}
                className={`flex items-center gap-3 text-left px-4 py-3 rounded-xl border-2 transition-all ${cls} disabled:cursor-default`}
              >
                <span className="shrink-0 w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm font-bold">
                  {LETTERS[i]}
                </span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => {
            const next = [...answers];
            next[index] = null;
            setAnswers(next);
            if (index + 1 >= questions.length) finishRef.current();
            else {
              setIndex(index + 1);
              setPicked(null);
            }
          }}
          className="mt-4 text-sm text-muted-foreground hover:text-foreground underline underline-offset-2"
        >
          Skip this question →
        </button>
      </div>
    </div>
  );
}

/* ═══════════════ Printable Worksheet ═══════════════ */
function Worksheet({ today }: { today: Date }) {
  // Weekly rotation: a fresh sheet every Monday-ish (UTC week boundary).
  const questions = useMemo(
    () =>
      getQuizQuestions(
        'grades-3-4',
        WORKSHEET_COUNT,
        Math.floor(dayNumber(today) / 7),
        today,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [Math.floor(dayNumber(today) / 7)],
  );

  const print = () => {
    trackEvent('WorksheetPrinted', { game: 'kangaroo' });
    window.print();
  };

  return (
    <div>
      <div className="kq-no-print flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-xl font-bold">Printable Practice Sheet</h2>
        <button
          type="button"
          onClick={print}
          data-testid="kq-worksheet-print"
          className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow transition-all hover:-translate-y-0.5"
        >
          🖨 Print worksheet
        </button>
      </div>
      <p className="kq-no-print text-sm text-muted-foreground mb-4">
        {WORKSHEET_COUNT} Kangaroo-style problems, refreshed weekly. The answer
        key prints on the last page for parents and teachers.
      </p>

      {/* ── printable sheet ── */}
      <div className="kq-worksheet rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-card p-6 sm:p-8 text-slate-900 dark:text-slate-100">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-black">Math Kangaroo Practice</h3>
          <p className="text-sm text-slate-500">
            Grades 3–4 · {WORKSHEET_COUNT} problems · inspired by the Math
            Kangaroo style
          </p>
          <div className="flex justify-between text-sm mt-4 border-b border-slate-300 pb-2">
            <span>
              Name: <span className="inline-block w-40 border-b border-slate-400" />
            </span>
            <span>Date: {utcDateKey(today)}</span>
          </div>
        </div>

        <ol className="space-y-5">
          {questions.map((q, i) => (
            <li key={q.id} className="kq-ws-item">
              <p className="font-medium">
                {i + 1}. <span className="text-xs text-slate-500">({q.points} pts)</span>{' '}
                {q.question}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 mt-1.5 ml-1 text-sm">
                {q.options.map((opt, oi) => (
                  <span key={oi}>
                    {LETTERS[oi]}. {opt}
                  </span>
                ))}
              </div>
              <div className="mt-2 ml-1 h-10 border-b border-dashed border-slate-300" />
            </li>
          ))}
        </ol>

        {/* answer key — last printed page */}
        <div className="kq-answer-key mt-8 pt-6 border-t-2 border-slate-300">
          <h4 className="font-black text-lg mb-1">Answer Key</h4>
          <p className="text-xs text-slate-500 mb-3">
            For parents and teachers — no peeking, kids! 🙈
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-1 text-sm">
            {questions.map((q, i) => (
              <span key={q.id}>
                {i + 1}. <strong>{LETTERS[q.answer]}</strong>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ Page ═══════════════ */
const TABS: { id: Tab; label: string }[] = [
  { id: 'daily', label: '📅 Daily Challenge' },
  { id: 'quiz', label: '⏱ Timed Quiz' },
  { id: 'worksheet', label: '🖨 Worksheet' },
];

export function KangarooPrep() {
  const [mounted, setMounted] = useState(false);
  const [today, setToday] = useState<Date | null>(null);
  const [tab, setTab] = useState<Tab>('daily');

  useEffect(() => {
    setToday(new Date());
    setMounted(true);
  }, []);

  return (
    <article className="min-h-screen bg-gradient-to-b from-violet-50 via-background to-background dark:from-violet-950/20 dark:via-background dark:to-background">
      {/* print stylesheet: only the worksheet survives printing */}
      <style>{`
        @media print {
          .kq-no-print { display: none !important; }
          .kq-answer-key { break-before: page; }
          .kq-worksheet { border: none !important; box-shadow: none !important; }
        }
      `}</style>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="kq-no-print">
          <Link
            href="/tools/education"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform"><path d="M15 18l-6-6 6-6"/></svg>
            Back to Education
          </Link>

          <div className="mt-8 mb-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-violet-400/60" />
              <span className="text-violet-500 dark:text-violet-400 text-2xl">🦘</span>
              <span className="h-px w-12 bg-gradient-to-l from-transparent to-violet-400/60" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-violet-700 via-purple-600 to-fuchsia-600 dark:from-violet-400 dark:via-purple-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
              Math Kangaroo Prep
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
              Daily challenges, timed quizzes and printable worksheets for
              grades 3–4 — playful problem-solving practice inspired by the
              Math Kangaroo contest style.
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300">
                Grades 3–4 · Ecolier
              </span>
              <span className="text-xs text-muted-foreground">
                More grade levels coming soon
              </span>
            </div>
          </div>

          {/* tabs */}
          <div
            className="flex gap-2 justify-center mb-8"
            role="tablist"
            aria-label="Kangaroo prep sections"
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                data-testid={`kq-tab-${t.id}`}
                className={`px-4 sm:px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  tab === t.id
                    ? 'bg-violet-600 text-white shadow-lg'
                    : 'bg-white/70 dark:bg-card/70 border border-slate-200 dark:border-slate-700 hover:border-violet-400'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* tab panels */}
        <div className={tab === 'worksheet' ? '' : 'kq-no-print-sheet'}>
          {!mounted || !today ? (
            <div className="kq-no-print rounded-2xl border border-slate-200 dark:border-slate-700 p-10 text-center text-muted-foreground">
              Loading today&apos;s problems…
            </div>
          ) : (
            <>
              {tab === 'daily' && <DailyChallenge today={today} />}
              {tab === 'quiz' && <TimedQuiz today={today} />}
              {tab === 'worksheet' && <Worksheet today={today} />}
            </>
          )}
        </div>

        {/* SEO practice-problem library: crawlable per-problem pages */}
        <div className="kq-no-print mt-10 rounded-2xl border border-violet-200/70 dark:border-violet-800/40 bg-violet-50/60 dark:bg-violet-950/20 p-6 text-center">
          <p className="font-bold text-lg mb-1">📚 Browse all 40 practice problems</p>
          <p className="text-sm text-muted-foreground mb-4">
            Every problem as its own page — solve, reveal the answer, and
            print. Pick your grade:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/practice/kangaroo/grade-3/"
              className="px-6 py-2.5 rounded-full bg-violet-600 text-white font-semibold hover:bg-violet-700"
            >
              Grade 3 problems →
            </Link>
            <Link
              href="/practice/kangaroo/grade-4/"
              className="px-6 py-2.5 rounded-full border border-violet-300 dark:border-violet-700 font-semibold hover:bg-violet-100 dark:hover:bg-violet-900/40"
            >
              Grade 4 problems →
            </Link>
          </div>
        </div>

        {/* Newsletter CTA: weekly worksheet by email */}
        <div className="kq-no-print mt-6 rounded-2xl border border-emerald-200/70 dark:border-emerald-800/40 bg-emerald-50/60 dark:bg-emerald-950/20 p-6 text-center">
          <p className="font-bold text-lg mb-1">
            📬 Get the weekly worksheet by email
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            One email every Friday — this week&apos;s best problems, a
            printable worksheet, and a peek at next week. Free, no spam.
          </p>
          <Link
            href="/newsletter/"
            className="inline-block px-6 py-2.5 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
          >
            Subscribe free →
          </Link>
        </div>

        <div className="kq-no-print mt-10 mb-6">
          <UsefulnessFeedback
            page="tools-kangaroo"
            prompt="Was this practice helpful?"
            helper="One click helps us build more free contest prep you'll actually use."
          />
        </div>

        <div className="kq-no-print text-center pb-8 space-y-2">
          <p className="text-xs text-muted-foreground/70 max-w-xl mx-auto leading-relaxed">
            All practice problems are written by us, inspired by the Math
            Kangaroo style. We are not affiliated with or endorsed by Math
            Kangaroo, and these are not past contest questions.
          </p>
          <p className="text-xs text-muted-foreground/50">
            Progress is saved in this browser only. No data collected. Runs
            entirely on your device.
          </p>
        </div>
      </div>
    </article>
  );
}
