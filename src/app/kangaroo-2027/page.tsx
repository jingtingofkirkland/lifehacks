import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title:
    'Math Kangaroo 2027 Parent War Room: Dates, Registration & 20-Week Prep Plan - Great Seattle Life Hacks',
  description:
    'Everything a parent needs for Math Kangaroo 2027: key registration dates and fees, a 5-step registration walkthrough, a 20-week prep plan with free practice, and a printable checklist.',
  alternates: {
    canonical: 'https://lifehacks.zeey-app.net/kangaroo-2027/',
  },
};

const KEY_DATES = [
  {
    label: 'Registration opened',
    value: 'September 15, 2026',
    note: 'Student registration for the 2027 season is open now.',
  },
  {
    label: 'Regular registration deadline',
    value: 'December 31, 2026',
    note: 'Register by then to pay the regular fee.',
  },
  {
    label: 'Registration fee',
    value: '$20 per student',
    note: 'Late registration (Jan 1 - Feb 1) costs $35. No refunds after registration.',
  },
  {
    label: 'Competition',
    value: 'March 2027',
    note: 'Held at centers across the U.S. Check mathkangaroo.org for your center\'s exact date and time.',
  },
];

const REGISTRATION_STEPS = [
  {
    title: 'Start on the official site',
    body: 'Go to mathkangaroo.org and open student registration for the 2027 season. Registration opened September 15, 2026.',
  },
  {
    title: 'Choose your center',
    body: 'Pick a center in the state where you live. School (private) centers need an invitation code from your school; public centers accept any student. In-person and online proctored options are both offered.',
  },
  {
    title: 'Enter your student\'s info',
    body: 'Register at your child\'s actual school grade level — competing at a lower grade level is not allowed. Request any special accommodations at enrollment time.',
  },
  {
    title: 'Pay the fee',
    body: '$20 per student through December 31, 2026 ($35 in the late window, Jan 1 - Feb 1). Math Kangaroo does not offer cancellations or refunds after registration, so double-check the center before you pay.',
  },
  {
    title: 'Watch your email',
    body: 'Save the confirmation email and follow your center\'s instructions for competition day — arrival time, what to bring, and where materials (gift and participation ribbon) are handed out.',
  },
];

const PREP_PHASES = [
  {
    weeks: 'Weeks 1-6 · Oct - mid-Nov',
    title: 'Build the base',
    body: 'One problem a day, untimed. Start with 3-point style questions and focus on careful reading — most early misses are reading misses, not math misses.',
    cta: { href: '/practice/kangaroo/grade-3/', label: 'Start with Grade 3 practice' },
  },
  {
    weeks: 'Weeks 7-12 · mid-Nov - Dec',
    title: 'Add the clock',
    body: 'Mix in 4-point problems and take the first timed quiz (8 questions, 12 minutes). Timed practice teaches pacing: skip, mark, come back.',
    cta: { href: '/tools/kangaroo/', label: 'Take the timed quiz' },
  },
  {
    weeks: 'Weeks 13-17 · Jan',
    title: 'Reach for 5-pointers',
    body: 'Work the harder 5-point problem types weekly. Review every miss together and sort it: concept gap, misread, or ran out of time. Each kind has a different fix.',
    cta: { href: '/practice/kangaroo/grade-4/', label: 'Practice Grade 4 problems' },
  },
  {
    weeks: 'Weeks 18-20 · late Feb - Mar',
    title: 'Mock contests, then taper',
    body: 'Two full timed runs in contest conditions, light review in the final week, and an early night before competition day. Confidence is the last skill to train.',
    cta: { href: '/tools/kangaroo/', label: 'Run a final timed quiz' },
  },
];

const CHECKLIST = [
  'Registered before December 31 (regular $20 window)',
  'Center chosen in your home state; invitation code handy if it\'s a school center',
  'Confirmation email saved somewhere you can find it in March',
  'A weekly practice slot on the family calendar',
  'First timed quiz done — pacing baseline set',
  'Competition-day plan: arrival time, pencils, water bottle',
];

/**
 * Math Kangaroo 2027 parent hub ("war room"): official dates/fees,
 * registration walkthrough, a 20-week prep plan that routes into our
 * free practice assets, and a printable checklist with the full pack
 * as the newsletter lead magnet. Facts are from mathkangaroo.org; we
 * are not affiliated with Math Kangaroo USA.
 */
export default function Kangaroo2027Page() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-6">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-foreground font-medium">
            Math Kangaroo 2027
          </li>
        </ol>
      </nav>

      <h1 className="text-3xl font-bold mb-3">
        Math Kangaroo 2027: Parent War Room 🦘
      </h1>
      <p className="text-muted-foreground mb-8 leading-relaxed">
        Registration for Math Kangaroo 2027 is already open — and the regular
        $20 window closes December 31. This page pulls together the dates that
        matter, a step-by-step registration walkthrough, and a 20-week prep
        plan built on our free practice problems, so your family can do this
        on autopilot.
      </p>

      <h2 className="text-xl font-bold mb-4">Key dates &amp; fees</h2>
      <ul className="grid gap-4 sm:grid-cols-2 mb-4">
        {KEY_DATES.map((item) => (
          <li
            key={item.label}
            className="rounded-2xl border border-slate-200 dark:border-slate-700 p-5"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              {item.label}
            </p>
            <p className="font-semibold mb-1">{item.value}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {item.note}
            </p>
          </li>
        ))}
      </ul>
      <p className="text-sm text-muted-foreground mb-10">
        Source:{' '}
        <a
          href="https://mathkangaroo.org/mks/registration/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Math Kangaroo USA registration page
        </a>
        . Always confirm details there before you pay — dates and fees are set
        by Math Kangaroo USA, not by us.
      </p>

      <h2 className="text-xl font-bold mb-4">How to register in 5 steps</h2>
      <ol className="space-y-4 mb-10">
        {REGISTRATION_STEPS.map((step, i) => (
          <li
            key={step.title}
            className="rounded-2xl border border-slate-200 dark:border-slate-700 p-5 flex gap-4"
          >
            <span
              aria-hidden
              className="shrink-0 w-8 h-8 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 font-bold flex items-center justify-center"
            >
              {i + 1}
            </span>
            <div>
              <p className="font-semibold mb-1">{step.title}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.body}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div className="rounded-2xl border border-orange-200 dark:border-orange-800/50 bg-orange-50 dark:bg-orange-950/30 p-6 mb-10">
        <p className="font-semibold mb-1">
          📬 Get the free printable Kangaroo 2027 pack
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          The full one-page registration checklist, a week-by-week prep tracker,
          and a fresh printable worksheet every Friday — free, no spam,
          unsubscribe anytime.
        </p>
        <Link
          href="/newsletter/"
          className="inline-block rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 text-sm"
        >
          Get the free printable pack + weekly worksheet
        </Link>
      </div>

      <h2 className="text-xl font-bold mb-4">
        The 20-week prep plan (Oct → March)
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Twenty weeks sounds like a lot. It isn&apos;t: it is one short practice
        session a day and one timed quiz a week. Our 40 original practice
        problems and timed quiz cover the whole arc — here is how to pace them.
      </p>
      <div className="space-y-4 mb-10">
        {PREP_PHASES.map((phase) => (
          <section
            key={phase.title}
            className="rounded-2xl border border-slate-200 dark:border-slate-700 p-5"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              {phase.weeks}
            </p>
            <p className="font-semibold mb-1">{phase.title}</p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              {phase.body}
            </p>
            <Link
              href={phase.cta.href}
              className="text-sm font-semibold text-primary hover:underline"
            >
              {phase.cta.label} →
            </Link>
          </section>
        ))}
      </div>

      <h2 className="text-xl font-bold mb-4">Parent checklist</h2>
      <ul className="space-y-2 mb-6">
        {CHECKLIST.map((item) => (
          <li key={item} className="flex gap-2.5 text-sm leading-relaxed">
            <span aria-hidden>☐</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <p className="text-sm text-muted-foreground leading-relaxed mb-10">
        Want this as a one-page printable with the week-by-week tracker? It is
        in the free pack below.
      </p>

      <div className="rounded-2xl border border-orange-200 dark:border-orange-800/50 bg-orange-50 dark:bg-orange-950/30 p-6 mb-10">
        <p className="font-semibold mb-1">
          📬 Get the free printable Kangaroo 2027 pack
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          The full one-page registration checklist, a week-by-week prep tracker,
          and a fresh printable worksheet every Friday — free, no spam,
          unsubscribe anytime.
        </p>
        <Link
          href="/newsletter/"
          className="inline-block rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 text-sm"
        >
          Get the free printable pack + weekly worksheet
        </Link>
      </div>

      <p className="text-xs text-muted-foreground/70 max-w-xl leading-relaxed">
        Dates, fees, and registration rules above are from Math Kangaroo USA
        (mathkangaroo.org) as of October 2026 and can change — the official
        site is the final word. Our practice problems are original and written
        in the Kangaroo spirit; we are not affiliated with or endorsed by Math
        Kangaroo USA.
      </p>
    </div>
  );
}
