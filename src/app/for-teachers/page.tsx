import type { Metadata } from 'next';
import Link from 'next/link';
import { UsefulnessFeedback } from '@/components/UsefulnessFeedback';

export const metadata: Metadata = {
  title:
    'For Teachers: Free 5-Day Math Challenge Pack (Grades 3–4) - Great Seattle Life Hacks',
  description:
    'A free, print-ready 5-Day Math Challenge for grades 3–4 classrooms: one Kangaroo-style problem per day, a full answer key, and a class progress poster. No account, copy as much as you like.',
  alternates: {
    canonical: 'https://lifehacks.zeey-app.net/for-teachers/',
  },
};

const PROMISES = [
  {
    emoji: '🆓',
    title: 'Free — really free',
    body: 'No paywall, no trial, no "premium version." Print the whole pack today and use it forever.',
  },
  {
    emoji: '🔓',
    title: 'No account, no student data',
    body: 'Nothing to sign up for and nothing to install. Kids never enter names or emails anywhere — paper works beautifully.',
  },
  {
    emoji: '🖨️',
    title: 'Copy as much as you like',
    body: 'One class, a whole grade level, the entire school — photocopy freely. Black-and-white friendly, low ink.',
  },
];

const INSIDE = [
  {
    title: '5 problems, Monday → Friday',
    body: 'Hand-picked from our 40 original Kangaroo-style practice problems, sequenced from a gentle 3-pointer to a real 5-point thinker.',
  },
  {
    title: 'Answer key with explanations',
    body: 'Kid-friendly worked solutions for all five problems, written so you can talk through them with the class on Friday.',
  },
  {
    title: 'Class progress star poster',
    body: 'A one-page wall chart: students color in a star for each day they give the problem a real try. Effort counts, not just right answers.',
  },
  {
    title: 'The same problems online (optional)',
    body: 'Every pack problem also lives in our free interactive practice with a daily challenge and timed quizzes — handy for projectors and centers.',
    href: '/tools/kangaroo/',
    linkLabel: 'Open the online practice →',
  },
];

const STEPS = [
  {
    title: 'Print once (7 pages)',
    body: 'Print a class set of the five problem sheets, one copy of the answer key for you, and one star poster for the wall.',
  },
  {
    title: 'One problem each morning',
    body: 'Hand out or project the day\'s problem as a 5–10 minute warm-up. Monday starts easy so everyone gets an early win.',
  },
  {
    title: 'Stars on the poster',
    body: 'After each problem, students color in that day\'s star — for a genuine try, whether or not they got it right.',
  },
  {
    title: 'Friday: the big reveal',
    body: 'Go through the answer key together and let students show their different solution paths. Five stars = Challenge Champions.',
  },
];

/**
 * /for-teachers/ landing page: the classroom/PTA entry point for the
 * 5-Day Math Challenge Pack. Written for 3rd–4th grade teachers, PTA
 * volunteers, and math-club organizers; routes them to the printable
 * pack (/for-teachers/challenge-pack/) and the weekly worksheet
 * newsletter. Style follows the Education section (emerald theme).
 */
export default function ForTeachersPage() {
  return (
    <article className="min-h-screen bg-gradient-to-b from-emerald-50 via-teal-50/80 to-background dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-background">
      <div className="relative max-w-3xl mx-auto px-4 py-8">
        {/* ── Back link ── */}
        <Link href="/tools" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors group">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform"><path d="M15 18l-6-6 6-6"/></svg>
          Back to Tools
        </Link>

        {/* ── Header ── */}
        <div className="mt-8 mb-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-emerald-400/60" />
            <span className="text-emerald-500 dark:text-emerald-400 text-2xl">🍎</span>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-emerald-400/60" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
            For Teachers &amp; Classrooms
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
            A free <strong className="text-foreground">5-Day Math Challenge</strong> for
            grades 3–4: one playful, contest-style problem a day for a school
            week — print-ready, with answers, explanations, and a star poster
            for your wall. Made for teachers, PTA volunteers, and math-club
            organizers.
          </p>
          <div className="mt-6">
            <Link
              href="/for-teachers/challenge-pack/"
              data-testid="ft-open-pack"
              className="inline-flex items-center justify-center gap-1.5 px-8 py-3.5 rounded-full bg-emerald-600 text-white font-semibold text-lg hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-emerald-950 transition-colors shadow"
            >
              🖨️ Get the free pack
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </Link>
            <p className="text-xs text-muted-foreground mt-2">
              Opens a print-ready page — 7 pages, black-and-white friendly.
            </p>
          </div>
        </div>

        {/* ── What it is: the three promises ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">What it is</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {PROMISES.map((p) => (
              <div
                key={p.title}
                className="p-5 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/40 bg-white/80 dark:bg-card/80"
              >
                <p className="text-3xl mb-2" aria-hidden>{p.emoji}</p>
                <h3 className="font-semibold mb-1">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── What's inside ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">What&apos;s inside the pack</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {INSIDE.map((item) => (
              <div
                key={item.title}
                className="p-5 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/40 bg-white/80 dark:bg-card/80"
              >
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                {item.href && (
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:underline underline-offset-2"
                  >
                    {item.linkLabel}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">How a 5-day challenge works</h2>
          <ol className="space-y-4">
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                className="rounded-2xl border border-emerald-200/80 dark:border-emerald-800/40 bg-white/80 dark:bg-card/80 p-5 flex gap-4"
              >
                <span
                  aria-hidden
                  className="shrink-0 w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 font-bold flex items-center justify-center"
                >
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold mb-1">{step.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-6 text-center">
            <Link
              href="/for-teachers/challenge-pack/"
              className="inline-flex items-center justify-center gap-1.5 px-8 py-3.5 rounded-full bg-emerald-600 text-white font-semibold text-lg hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-emerald-950 transition-colors shadow"
            >
              🖨️ Print the pack
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </Link>
          </div>
        </section>

        {/* ── Built by a local parent ── */}
        <section className="mb-12 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/40 bg-gradient-to-br from-emerald-100/90 via-teal-50/70 to-white/90 dark:from-emerald-950/70 dark:via-teal-950/40 dark:to-card/90 p-6">
          <h2 className="text-xl font-bold mb-2">Built by a local parent, free for classrooms</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Hi — this site is a side project by a Seattle-area parent, started
            for our own kid&apos;s math club and the families around it. The
            problems are written to feel like the playful contest questions
            kids actually enjoy, and everything here is free for classroom use.
            If your class runs the challenge, we&apos;d genuinely love to hear
            how it went — what landed, what flopped — so the next pack is
            better.
          </p>
        </section>

        {/* ── Newsletter CTA ── */}
        <section className="mb-12">
          <div className="relative overflow-hidden p-6 sm:p-7 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/40 bg-gradient-to-br from-emerald-100/90 via-teal-50/70 to-white/90 dark:from-emerald-950/70 dark:via-teal-950/40 dark:to-card/90 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="shrink-0 w-12 h-12 rounded-xl bg-emerald-600 dark:bg-emerald-500 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-10 6L2 7" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold">Teachers: a fresh worksheet every Friday</h2>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  Our weekly worksheet email is made for classrooms too —
                  hand-picked problems and a fresh printable every Friday, so
                  your next challenge week plans itself. Free, no spam,
                  unsubscribe anytime.
                </p>
              </div>
              <Link
                href="/newsletter/"
                className="inline-flex shrink-0 items-center justify-center gap-1.5 px-6 py-3 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-emerald-950 transition-colors"
              >
                Subscribe free
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Feedback ── */}
        <div className="mb-10">
          <UsefulnessFeedback
            page="for-teachers"
            prompt="Teachers — was this page helpful?"
            helper="One click helps us build more free classroom resources you'll actually use."
          />
        </div>

        {/* ── Disclaimer ── */}
        <p className="text-xs text-muted-foreground/70 max-w-xl mx-auto leading-relaxed text-center pb-8">
          All problems in the pack are original, written by us in the Math
          Kangaroo style — they are not past contest questions. We are not
          affiliated with or endorsed by Math Kangaroo USA or any school
          district.
        </p>
      </div>
    </article>
  );
}
