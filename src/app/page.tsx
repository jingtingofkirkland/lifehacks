import type { Metadata } from 'next';
import Link from 'next/link';
import { NewsletterForm } from '@/components/NewsletterForm';

const HOME_DESCRIPTION =
  'Free math practice, games and printable worksheets for elementary kids — plus practical everyday tools, space & AI explainers, and Seattle know-how. Little hacks that make family life easier.';

export const metadata: Metadata = {
  // <title> carries the search keywords, the H1 carries the brand
  // (v3 brand correction, 2026-10-21): title管搜索、H1管品牌.
  title:
    'Great Seattle Life Hacks — Free Math Practice, Tools & Tech for Families',
  description: HOME_DESCRIPTION,
  alternates: { canonical: 'https://lifehacks.zeey-app.net/' },
  openGraph: {
    type: 'website',
    siteName: 'Great Seattle Life Hacks',
    title:
      'Great Seattle Life Hacks — Free Math Practice, Tools & Tech for Families',
    description: HOME_DESCRIPTION,
    url: 'https://lifehacks.zeey-app.net/',
    images: [{ url: '/logo.png' }],
  },
  twitter: {
    card: 'summary',
    title:
      'Great Seattle Life Hacks — Free Math Practice, Tools & Tech for Families',
    description: HOME_DESCRIPTION,
    images: ['/logo.png'],
  },
};

/**
 * Homepage (redesign preview, 2026-10-21): the page is now a router +
 * signup surface instead of the old SpaceX-style full-screen showcase.
 * The flagship tools as cards, the real Tally newsletter form embedded,
 * and below the education block the Space / AI / Life Saver Tools
 * sections as three proper sibling section blocks (title + one-liner +
 * button, one click straight into each section) — real sections with
 * real weight, just below education. No sub-page listings on the
 * homepage: one level per section block is enough (user call,
 * 2026-10-21). Copy rule: no invented numbers — no subscriber counts,
 * no testimonials; only statements that are true of the site today.
 *
 * v3 brand correction (2026-10-21): the H1 is the brand — Great Seattle
 * Life Hacks — under an umbrella subtitle that names every side of the
 * site (tools, learning, tech, Seattle know-how). Education is the
 * biggest block, not the site's identity: the math positioning moved
 * down one level into the education block's own H2, while the <title>
 * keeps the search keywords. The hero CTAs still route into the
 * education block (readiness check / math games).
 */

const TOOL_CARDS = [
  {
    emoji: '🧭',
    title: 'Kangaroo Readiness Check',
    body: 'Nine quick questions show exactly which topics are strong — and what to practice next. Free, about 2 minutes.',
    href: '/tools/kangaroo/readiness/',
    cta: 'Take the free check',
  },
  {
    emoji: '🦘',
    title: 'Math Kangaroo 2027 — Washington Guide',
    body: 'Dates, fees, registration and how to host a center at your school — everything WA families need for the March 2027 contest.',
    href: '/kangaroo-2027-wa/',
    cta: 'Read the WA guide',
  },
  {
    emoji: '📅',
    title: 'Free 20-Week Cohort Plan',
    body: 'A week-by-week training plan that walks your child from first practice to contest day — March 18, 2027.',
    href: '/kangaroo-2027/cohort/',
    cta: 'See the plan',
  },
  {
    emoji: '📝',
    title: 'Practice Problems & Worksheets',
    body: 'Kangaroo-style problems with answers and step-by-step explanations, plus printable sheets for the fridge or the classroom.',
    href: '/tools/kangaroo/',
    cta: 'Start practicing',
  },
  {
    emoji: '🎮',
    title: 'Math Games for Kids',
    body: 'Merge Racer, Bubble Pop and Bridge Builder — quick games that drill addition, missing numbers and word problems.',
    href: '/tools/education/',
    cta: 'Play the games',
  },
  {
    emoji: '🎨',
    title: 'Draw & Guess — Family Game',
    body: 'A pass-and-play drawing game for the whole family: one phone, no accounts, just draw and guess out loud.',
    href: '/tools/draw-guess/',
    cta: 'Play together',
  },
];

const SECTION_BLOCKS = [
  {
    emoji: '🚀',
    title: 'Space Tech',
    body: 'Rocket launches and space missions, explained for curious grown-ups.',
    href: '/space/',
    cta: 'Explore Space Tech',
    cardClass:
      'border-indigo-200 dark:border-indigo-800/60 bg-indigo-50/70 dark:bg-indigo-950/25 hover:border-indigo-400 dark:hover:border-indigo-500',
    buttonClass: 'bg-indigo-600 group-hover:bg-indigo-700',
  },
  {
    emoji: '🤖',
    title: 'AI Techs',
    body: 'Tech articles and tutorials for everyday learning and professional growth.',
    href: '/tech/',
    cta: 'Explore AI Techs',
    cardClass:
      'border-teal-200 dark:border-teal-800/60 bg-teal-50/70 dark:bg-teal-950/25 hover:border-teal-400 dark:hover:border-teal-500',
    buttonClass: 'bg-teal-600 group-hover:bg-teal-700',
  },
  {
    emoji: '🧰',
    title: 'Life Saver Tools',
    body: 'Printable calendars and handy everyday tools that just work.',
    href: '/tools/',
    cta: 'Explore Life Saver Tools',
    cardClass:
      'border-amber-200 dark:border-amber-800/60 bg-amber-50/70 dark:bg-amber-950/25 hover:border-amber-400 dark:hover:border-amber-500',
    buttonClass: 'bg-amber-600 group-hover:bg-amber-700',
  },
];

export default function HomePage() {
  return (
    <main>
      {/* ── Hero: the brand umbrella, CTAs route into education ──── */}
      <section className="bg-gradient-to-b from-sky-50 via-white to-white dark:from-sky-950/40 dark:via-background dark:to-background border-b border-slate-200/70 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 pt-14 pb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-sky-700 dark:text-sky-300 mb-4">
            Free for families · Made in Seattle
          </p>
          <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-4">
            Great Seattle Life Hacks
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
            Practical tools, playful learning, tech explainers and Seattle
            know-how — little hacks that make family life easier.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-5">
            <Link
              href="/tools/kangaroo/readiness/"
              className="w-full sm:w-auto inline-block rounded-full bg-sky-700 hover:bg-sky-800 text-white font-semibold px-7 py-3.5 text-base transition-colors"
            >
              🧭 Take the free 2-minute readiness check
            </Link>
            <Link
              href="/tools/education/"
              className="w-full sm:w-auto inline-block rounded-full border-2 border-sky-700 text-sky-800 dark:border-sky-400 dark:text-sky-300 font-semibold px-7 py-3 transition-colors hover:bg-sky-50 dark:hover:bg-sky-950/40"
            >
              🎮 Play a math game
            </Link>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Free forever · No sign-up to play · New worksheets every Friday
          </p>
        </div>
      </section>

      {/* ── Seasonal strip (October): Halloween math pack ─────────── */}
      <div className="max-w-5xl mx-auto px-4 mt-8">
        <Link
          href="/tools/halloween-math/"
          className="flex items-center gap-3 rounded-2xl border border-orange-300/80 dark:border-orange-700/50 bg-orange-50 dark:bg-orange-950/30 px-5 py-4 hover:border-orange-400 dark:hover:border-orange-500 transition-colors"
        >
          <span className="text-2xl" aria-hidden>
            🎃
          </span>
          <span className="text-sm sm:text-base">
            <span className="font-semibold">New for Halloween:</span>{' '}
            <span className="text-muted-foreground">
              a spooky math hunt — 12 free printable problems for grades 3–4.
            </span>{' '}
            <span className="font-semibold text-orange-700 dark:text-orange-300">
              Grab the pack →
            </span>
          </span>
        </Link>
      </div>

      {/* ── Education block: the biggest block, with its own H2 ──── */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-2">
          Math practice &amp; games for elementary kids
        </h2>
        <p className="text-center text-muted-foreground mb-8">
          Start here — pick the next step for your child. Everything is
          free and works right in the browser.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOL_CARDS.map((card) => (
            <div
              key={card.title}
              className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-card/70 p-5"
            >
              <p className="text-3xl mb-3" aria-hidden>
                {card.emoji}
              </p>
              <h3 className="font-bold mb-1.5">{card.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                {card.body}
              </p>
              <Link
                href={card.href}
                className="font-semibold text-sky-700 dark:text-sky-300 hover:underline text-sm"
              >
                {card.cta} →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Subscribe band: the real Tally form, embedded ─────────── */}
      <section className="bg-sky-50/70 dark:bg-sky-950/20 border-y border-slate-200/70 dark:border-slate-800">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-center mb-3">
            📬 Get a fresh worksheet every Friday
          </h2>
          <p className="text-center text-muted-foreground leading-relaxed mb-3">
            Join the Weekly Worksheet Newsletter — one email each Friday
            with new Kangaroo-style problems, a printable worksheet, and a
            peek at next week. Your first email includes the complete
            40-problem printable pack.
          </p>
          <p className="text-center text-sm text-muted-foreground mb-8">
            🦘 Training for Kangaroo 2027? The newsletter follows the free
            20-week cohort plan week by week, all the way to contest day.
          </p>
          <NewsletterForm />
          <p className="text-xs text-muted-foreground text-center mt-4">
            Free · Unsubscribe anytime · We only email the weekly worksheet.
          </p>
        </div>
      </section>

      {/* ── Sibling sections: proper blocks, one click straight in ── */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-2">
          More sections to explore
        </h2>
        <p className="text-center text-muted-foreground mb-8">
          Three sibling sections of the site — tap a block to jump straight
          in.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {SECTION_BLOCKS.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className={`group flex flex-col rounded-2xl border p-6 transition-all hover:shadow-md ${item.cardClass}`}
            >
              <p className="text-4xl mb-3" aria-hidden>
                {item.emoji}
              </p>
              <h3 className="text-lg font-bold mb-1.5">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">
                {item.body}
              </p>
              <span
                className={`mt-auto inline-block self-start rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-colors ${item.buttonClass}`}
              >
                {item.cta} →
              </span>
            </Link>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-10 text-center">
          Great Seattle Life Hacks — made with care in the Seattle area.
        </p>
      </section>
    </main>
  );
}
