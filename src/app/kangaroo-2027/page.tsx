import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title:
    'Math Kangaroo 2027: Dates, Registration & 20-Week Prep Plan for Parents - Great Seattle Life Hacks',
  description:
    'The parent war room for Math Kangaroo 2027: key dates (register by Dec 31, 2026; competition March 18, 2027), a 5-step registration guide, and a calm week-by-week prep plan using free practice.',
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
    label: 'Register by (regular fee)',
    value: 'December 31, 2026',
    note: '$20 per student. After this date the late fee applies.',
  },
  {
    label: 'Late registration',
    value: 'January 1 – February 1, 2027',
    note: '$35 per student. Final window — no registrations after Feb 1.',
  },
  {
    label: 'Competition day',
    value: 'Thursday, March 18, 2027',
    note: 'One day only, at your registered center. No make-up date.',
  },
];

const REGISTRATION_STEPS = [
  {
    title: 'Find your center',
    body: 'Every student competes through a registered center. If your child\u2019s school hosts one, ask the school office for its Center Invitation Code (private centers are invitation-only). Otherwise, pick a Public Center near you — those accept students from any school.',
  },
  {
    title: 'Create your account on the official site',
    body: 'Registration happens on mathkangaroo.org, run by Math Kangaroo USA. You\u2019ll register under your own parent account and add your child as the participant.',
  },
  {
    title: 'Register at your child\u2019s current grade',
    body: 'The participation level is your child\u2019s actual school grade — competing at a lower grade level is not allowed. For in-person centers, choose a center in the state where you live.',
  },
  {
    title: 'Pay the fee and save the confirmation',
    body: '$20 per student through December 31, 2026; $35 during the late window (January 1 – February 1, 2027). Registration is final — Math Kangaroo does not offer cancellations or refunds, so double-check the center and grade before paying.',
  },
  {
    title: 'Watch for center emails',
    body: 'Your center manager confirms the room, start time, and what to bring. Any test-day gifts and ribbons are handed out by the center on competition day. Need special accommodations? Request them at enrollment time, not later.',
  },
];

const PREP_PHASES = [
  {
    phase: 'Phase 1 · October – November: Build the habit',
    body: 'One short problem a day beats a weekend cram. Start with our daily challenge problem, then browse the problem library by grade and work through a few each week together.',
    links: [
      { href: '/tools/kangaroo/', label: 'Daily challenge & quiz' },
      { href: '/practice/kangaroo/grade-3/', label: 'Grade 3 problems' },
      { href: '/practice/kangaroo/grade-4/', label: 'Grade 4 problems' },
    ],
  },
  {
    phase: 'Phase 2 · December: Register, then first timed run',
    body: 'Lock in registration before the December 31 regular-fee deadline. Then take the first timed quiz (8 questions, 12 minutes) to get a baseline — no pressure, just a starting line.',
    links: [{ href: '/tools/kangaroo/', label: 'Take the timed quiz' }],
  },
  {
    phase: 'Phase 3 · January – February: Weekly rhythm',
    body: 'Settle into one timed quiz plus one printed worksheet per week. Mix in the harder 4- and 5-point problems, and revisit any problem type that keeps tripping your child up.',
    links: [
      { href: '/tools/kangaroo/', label: 'Weekly timed quiz' },
      { href: '/tools/education/', label: 'More free math tools' },
    ],
  },
  {
    phase: 'Phase 4 · Early March: Taper and rehearse',
    body: 'Two weeks out, ease off new material. Do one final timed run about a week before competition day, walk through the logistics (where, when, what to bring), and keep it light and fun.',
    links: [{ href: '/tools/kangaroo/', label: 'Final practice run' }],
  },
];

const CHECKLIST_TEASER = [
  'Registered — and the confirmation email is saved somewhere safe',
  'Center chosen, competition day (Mar 18, 2027) on the family calendar',
  'A weekly practice slot picked — same time each week',
  'First timed mock done: 8 questions, 12 minutes',
  'Full printable pack: this checklist + 20-week planner + tracking sheets',
];

/**
 * Math Kangaroo 2027 parent hub ("war room"): key dates, a plain-English
 * registration walkthrough, and a week-by-week prep rhythm built on the
 * site's existing free practice assets. We are an independent prep resource
 * and say so explicitly; all registration facts come from mathkangaroo.org.
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
        Math Kangaroo 2027: The Parent War Room 🦘
      </h1>
      <p className="text-muted-foreground mb-8 leading-relaxed">
        Your child is competing in Math Kangaroo 2027 — or thinking about it.
        This page is the calm, everything-in-one-place version: the dates that
        actually matter, how registration really works, and a gentle
        week-by-week prep rhythm from now until competition day. No cram
        school, no panic buying — just a plan.
      </p>

      <h2 className="text-xl font-bold mb-4">The season at a glance</h2>
      <ul className="grid gap-4 sm:grid-cols-2 mb-4">
        {KEY_DATES.map((item) => (
          <li
            key={item.label}
            className="rounded-2xl border border-slate-200 dark:border-slate-700 p-5"
          >
            <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
            <p className="font-bold text-lg mb-1">{item.value}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {item.note}
            </p>
          </li>
        ))}
      </ul>
      <p className="text-sm text-muted-foreground mb-10">
        Facts straight from the official source:{' '}
        <a
          href="https://mathkangaroo.org/mks/registration/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground"
        >
          Math Kangaroo USA — 2027 Registration
        </a>
        . Always confirm details there before you pay, since centers and fees
        can change.
      </p>

      <h2 className="text-xl font-bold mb-4">How registration works</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        Math Kangaroo is a center-based competition: kids test in person (or
        online through their center) on the same day, proctored by their
        center. Parents register directly on the official site — here is the
        whole flow in five steps.
      </p>
      <ol className="space-y-4 mb-6">
        {REGISTRATION_STEPS.map((step, i) => (
          <li
            key={step.title}
            className="rounded-2xl border border-slate-200 dark:border-slate-700 p-5 flex gap-4"
          >
            <span
              aria-hidden
              className="flex-none w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center"
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
      <div className="rounded-2xl border border-amber-200 dark:border-amber-800/50 bg-amber-50/60 dark:bg-amber-950/20 p-5 mb-10">
        <p className="text-sm leading-relaxed">
          <strong>Please note:</strong> Great Seattle Life Hacks is an
          independent prep resource. We are not affiliated with or endorsed by
          Math Kangaroo USA, and we can&apos;t register your child, change a
          registration, or answer questions about fees — for those, use the
          official site linked above. What we do is free practice to help your
          child walk in confident.
        </p>
      </div>

      {/* Mid-page subscription CTA */}
      <div className="rounded-2xl border border-emerald-200/70 dark:border-emerald-800/40 bg-emerald-50/60 dark:bg-emerald-950/20 p-6 text-center mb-10">
        <p className="font-bold text-lg mb-1">
          📬 Get the printable Kangaroo 2027 prep pack
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Subscribe free and we&apos;ll send the full printable pack — the
          complete checklist, a 20-week planner, and a fresh practice worksheet
          every Friday. Free, no spam, unsubscribe anytime.
        </p>
        <Link
          href="/newsletter/"
          className="inline-block px-6 py-2.5 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
        >
          Subscribe free →
        </Link>
      </div>

      <h2 className="text-xl font-bold mb-4">
        The prep rhythm: now to competition day
      </h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        There are roughly twenty practice weeks between now and March 18,
        2027. Kangaroo problems reward clever thinking over speed-drilling, so
        the winning formula is small and steady: a little every week, timed
        practice once in a while, and lots of &ldquo;how did you figure that
        out?&rdquo; conversations.
      </p>
      <div className="space-y-4 mb-10">
        {PREP_PHASES.map((phase) => (
          <div
            key={phase.phase}
            className="rounded-2xl border border-slate-200 dark:border-slate-700 p-5"
          >
            <p className="font-semibold mb-2">{phase.phase}</p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              {phase.body}
            </p>
            <div className="flex flex-wrap gap-2">
              {phase.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm px-4 py-1.5 rounded-full border border-emerald-300 dark:border-emerald-700 font-medium hover:bg-emerald-50 dark:hover:bg-emerald-900/40"
                >
                  {link.label} →
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold mb-4">The parent checklist</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        Five things between you and a stress-free March. Here&apos;s the short
        version — the printable pack (with the full planner and tracking
        sheets) goes to subscribers.
      </p>
      <ul className="rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-3 mb-10">
        {CHECKLIST_TEASER.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-relaxed">
            <span aria-hidden className="flex-none">
              ☐
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {/* End-of-page subscription CTA */}
      <div className="rounded-2xl border border-emerald-200/70 dark:border-emerald-800/40 bg-emerald-50/60 dark:bg-emerald-950/20 p-6 text-center mb-8">
        <p className="font-bold text-lg mb-1">
          📬 One email every Friday, all season long
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          The weekly worksheet newsletter carries your family from first
          practice to competition day — including the printable Kangaroo 2027
          prep pack for subscribers. Free, no spam.
        </p>
        <Link
          href="/newsletter/"
          className="inline-block px-6 py-2.5 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
        >
          Subscribe free →
        </Link>
      </div>

      <p className="text-xs text-muted-foreground/70 max-w-xl leading-relaxed">
        All practice problems on this site are written by us, inspired by the
        Math Kangaroo style. We are not affiliated with or endorsed by Math
        Kangaroo USA, and these are not past contest questions.
      </p>
    </div>
  );
}
