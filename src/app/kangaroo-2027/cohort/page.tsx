import type { Metadata } from 'next';
import Link from 'next/link';
import { SubscribeCta } from '@/components/SubscribeCta';
import { CohortStatus } from './CohortStatus';
import { PHASES } from './cohort';

export const metadata: Metadata = {
  title:
    'Math Kangaroo 2027 Cohort: The 20-Week Prep Plan to Contest Day - Great Seattle Life Hacks',
  description:
    'One free plan from now to Math Kangaroo contest day (Thursday, March 18, 2027): 20 weeks in four phases — build the base, add the clock, sharpen weak topics, mock contests — walked week by week in the Friday email.',
  alternates: {
    canonical: 'https://lifehacks.zeey-app.net/kangaroo-2027/cohort/',
  },
};

const KEY_DATES = [
  {
    label: 'School-center applications close',
    value: 'December 15, 2026',
    note: 'Schools can still apply to host a center (free, 10+ students) until this date — Week 9 of the cohort.',
  },
  {
    label: 'Regular registration deadline',
    value: 'December 31, 2026',
    note: 'The $20 window closes at the end of Week 11. After that it is $35, seats permitting.',
  },
  {
    label: 'Late registration closes',
    value: 'February 1, 2027',
    note: 'The last day to register at $35 (Week 16). After this, the 2027 season is closed.',
  },
  {
    label: 'Contest day',
    value: 'Thursday, March 18, 2027',
    note: 'One day only, no make-up date. The cohort is paced backwards from this morning.',
  },
];

const HOW_IT_WORKS = [
  {
    title: 'One plan, four phases',
    body: 'Twenty training weeks, grouped into four phases below. Each phase has one theme, a short list of parent moves, and links to the exact free tool for that phase — no new system to learn, nothing to buy.',
  },
  {
    title: 'The Friday email keeps the beat',
    body: 'The cohort runs on the Weekly Worksheet email. From Issue 3 on, every Friday email is stamped with the cohort week (Week N), so the plan lands in your inbox instead of living on a page you meant to bookmark.',
  },
  {
    title: 'Built from tools that are already free',
    body: 'The readiness check sets your baseline, the daily problem and 40 practice problems do the reps, the timed quiz teaches pacing, and the war rooms handle dates, centers, and contest day. The cohort just puts them in order.',
  },
];

/**
 * /kangaroo-2027/cohort/ (IDEA-20261012-01): the 20-week Kangaroo
 * 2027 companion cohort — the season-long plan that sequences the
 * readiness check, the practice library, the timed quiz, the war
 * rooms, and the Friday newsletter into four phases ending at
 * contest day, Thursday, March 18, 2027. Signup is the existing
 * newsletter; no new form, no new system.
 */
export default function KangarooCohortPage() {
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
          <li>
            <Link href="/kangaroo-2027/" className="hover:underline">
              Math Kangaroo 2027
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-foreground font-medium">
            20-Week Cohort
          </li>
        </ol>
      </nav>

      <h1 className="text-3xl font-bold mb-3">
        The Kangaroo Cohort: 20 Weeks to Contest Day 🦘
      </h1>
      <p className="text-muted-foreground mb-8 leading-relaxed">
        Most families prep for Math Kangaroo in scattered bursts — a
        worksheet here, a panicked search in February. The cohort is the
        opposite: one calm plan that runs from now to contest day,{' '}
        <strong className="text-foreground">
          Thursday, March 18, 2027
        </strong>
        , split into four phases. Do the phase you are in, one small move
        a week, and let the Friday email keep time for you.
      </p>

      <CohortStatus />

      <h2 className="text-xl font-bold mb-4">How the cohort works</h2>
      <div className="space-y-4 mb-10">
        {HOW_IT_WORKS.map((item, i) => (
          <section
            key={item.title}
            className="rounded-2xl border border-slate-200 dark:border-slate-700 p-5 flex gap-4"
          >
            <span
              aria-hidden
              className="shrink-0 w-8 h-8 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 font-bold flex items-center justify-center"
            >
              {i + 1}
            </span>
            <div>
              <p className="font-semibold mb-1">{item.title}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.body}
              </p>
            </div>
          </section>
        ))}
      </div>

      <h2 className="text-xl font-bold mb-4">The four phases</h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Find your phase, do its moves, ignore the rest for now. Every
        phase links the tool it uses — all of them are free and already
        on this site.
      </p>
      <div className="space-y-4 mb-10">
        {PHASES.map((phase) => (
          <section
            key={phase.id}
            id={`phase-${phase.id}`}
            data-testid={`cohort-phase-${phase.id}`}
            className="rounded-2xl border border-slate-200 dark:border-slate-700 p-5 scroll-mt-24"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Phase {phase.id} · {phase.weeksLabel} · {phase.datesLabel}
            </p>
            <p className="font-semibold text-lg mb-1">
              {phase.title} — {phase.theme}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {phase.body}
            </p>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Parent moves
            </p>
            <ul className="space-y-1.5 mb-4">
              {phase.actions.map((action) => (
                <li key={action} className="flex gap-2.5 text-sm leading-relaxed">
                  <span aria-hidden>☐</span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
            <p className="flex flex-wrap gap-x-5 gap-y-1">
              {phase.assets.map((asset) => (
                <Link
                  key={asset.href + asset.label}
                  href={asset.href}
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  {asset.label} →
                </Link>
              ))}
            </p>
          </section>
        ))}
      </div>

      <h2 className="text-xl font-bold mb-4">Dates the cohort is paced by</h2>
      <ul className="grid gap-4 sm:grid-cols-2 mb-10">
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

      <div className="mb-10">
        <SubscribeCta />
        <p className="text-sm text-muted-foreground leading-relaxed mt-3">
          Joining the email <em>is</em> joining the cohort — there is no
          separate signup. From Issue 3 on, the Friday email carries the
          cohort week in its header, plus that week&apos;s problem and
          printable.
        </p>
      </div>

      <h2 className="text-xl font-bold mb-4">The war rooms</h2>
      <div className="space-y-4 mb-10">
        <section className="rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
          <p className="font-semibold mb-1">National war room</p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            Dates, fees, the 5-step registration walkthrough, and the
            parent checklist — the reference page the cohort&apos;s
            registration moves point back to.
          </p>
          <Link
            href="/kangaroo-2027/"
            className="text-sm font-semibold text-primary hover:underline"
          >
            Open the Math Kangaroo 2027 war room →
          </Link>
        </section>
        <section className="rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
          <p className="font-semibold mb-1">Washington war room</p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            In WA? Centers, invitation codes, Eastside options, and the
            five pitfalls local families hit — the local layer of the
            same plan.
          </p>
          <Link
            href="/kangaroo-2027-wa/"
            className="text-sm font-semibold text-primary hover:underline"
          >
            Open the Washington Math Kangaroo guide →
          </Link>
        </section>
      </div>

      <p className="text-xs text-muted-foreground/70 max-w-xl leading-relaxed">
        Dates and fees above are from Math Kangaroo USA
        (mathkangaroo.org), checked October 2026, and can change — the
        official site is the final word. The cohort is our own free prep
        plan built around those dates; our practice problems are
        original and written in the Kangaroo spirit, and we are not
        affiliated with or endorsed by Math Kangaroo USA.
      </p>
    </div>
  );
}
