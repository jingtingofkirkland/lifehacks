/**
 * The Kangaroo 2027 cohort calendar (IDEA-20261012-01): 20 training
 * weeks from Monday, October 19, 2026 to contest week, ending at the
 * competition on Thursday, March 18, 2027. Pure data + date logic so
 * the week computation is unit-testable; the page renders the phases
 * from PHASES and the client banner maps "today" through
 * cohortStatus().
 *
 * Weeks run Monday–Sunday. After Week 20 (Mar 1–7) come the taper
 * week (Mar 8–14) and race week (Mar 15–21, contest on Mar 18).
 */

export interface CohortPhase {
  id: 1 | 2 | 3 | 4;
  weeksLabel: string;
  datesLabel: string;
  title: string;
  theme: string;
  body: string;
  assets: { href: string; label: string }[];
  actions: string[];
}

export const PHASES: CohortPhase[] = [
  {
    id: 1,
    weeksLabel: 'Weeks 1–6',
    datesLabel: 'Oct 19 – Nov 29, 2026',
    title: 'Build the base',
    theme: 'Know where you stand, then make practice a habit',
    body: 'Start with the 9-question readiness check, so practice targets real gaps instead of random worksheets. Then settle into one untimed problem a day, heavy on 3-point style questions and careful reading — most early misses are reading misses, not math misses.',
    assets: [
      { href: '/tools/kangaroo/readiness/', label: 'Readiness check' },
      { href: '/tools/kangaroo/', label: 'Daily problem & printables' },
      { href: '/kangaroo-2027-wa/', label: 'WA war room' },
    ],
    actions: [
      'Take the readiness check and save the topic report — that is your baseline.',
      'Finish registration while the regular $20 window is open (WA families: pick your center).',
      'Put one weekly practice slot on the family calendar and protect it.',
    ],
  },
  {
    id: 2,
    weeksLabel: 'Weeks 7–12',
    datesLabel: 'Nov 30, 2026 – Jan 10, 2027',
    title: 'Add the clock',
    theme: '4-point problems and first timed runs',
    body: 'Mix in 4-point problems and take one timed quiz a week. Timed practice teaches pacing: skip, mark, come back. Keep sorting every miss together — concept gap, misread, or ran out of time — because each kind has a different fix.',
    assets: [
      { href: '/tools/kangaroo/', label: 'Timed quiz' },
      { href: '/practice/kangaroo/grade-3/', label: 'Grade 3 problems' },
      { href: '/practice/kangaroo/grade-4/', label: 'Grade 4 problems' },
    ],
    actions: [
      'One timed quiz every week, reviewed together afterwards.',
      'Checkpoint dates: school-center applications close Dec 15 (Week 9); regular registration ends Dec 31 (Week 11).',
      'Keep a simple miss log by topic — it picks your Phase 3 drills for you.',
    ],
  },
  {
    id: 3,
    weeksLabel: 'Weeks 13–17',
    datesLabel: 'Jan 11 – Feb 14, 2027',
    title: 'Reach for 5-pointers',
    theme: 'Sharpen the weak topics',
    body: 'Work the harder 5-point problem types weekly and drill the two weakest topics from your readiness report. Mid-phase, retake the readiness check: the before/after topic bars are the clearest motivation a kid — or a parent — can get.',
    assets: [
      { href: '/tools/kangaroo/readiness/', label: 'Readiness check (retake)' },
      { href: '/practice/kangaroo/grade-4/', label: 'Grade 4 problems' },
      { href: '/tools/kangaroo/', label: 'Printable practice sheet' },
    ],
    actions: [
      'Retake the readiness check and compare the topic bars with October.',
      'Drill the two weakest topics, one topic per week.',
      'Not registered yet? The $35 late window closes Feb 1 (Week 16) — after that, the season is closed.',
    ],
  },
  {
    id: 4,
    weeksLabel: 'Weeks 18–20 + taper & race weeks',
    datesLabel: 'Feb 15 – Mar 18, 2027',
    title: 'Mock contests, then taper',
    theme: 'Full simulations, then arrive fresh',
    body: 'Two full timed runs in contest conditions — for grades 3–4 that means 24 questions in 75 minutes, at a table, no pausing. Then stop building and start tapering: light review in the Mar 8–14 taper week, early nights, and a calm contest morning on Thursday, March 18.',
    assets: [
      { href: '/tools/kangaroo/', label: 'Timed quiz (mock mode)' },
      { href: '/kangaroo-2027/', label: 'War room checklist' },
      { href: '/kangaroo-2027-wa/', label: 'WA contest-day guide' },
    ],
    actions: [
      'Two full mock runs in contest conditions (24 questions, 75 minutes).',
      'Taper week (Mar 8–14): light review only — no new problem types.',
      'Race week (Mar 15–21): confirm arrival time with your center; pencils, water bottle, early night.',
    ],
  },
];

/** Monday of Week 1. */
export const COHORT_START_ISO = '2026-10-19';
/** Competition day (Thursday). */
export const EXAM_ISO = '2027-03-18';

export type CohortStatus =
  | { kind: 'before'; daysUntilStart: number }
  | { kind: 'week'; week: number; phase: 1 | 2 | 3 | 4 }
  | { kind: 'taper' }
  | { kind: 'race' }
  | { kind: 'done' };

function dayNumber(d: Date): number {
  // Calendar-day index in UTC space, from the date's local Y/M/D, so
  // DST and time-of-day never shift a week boundary.
  return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86_400_000;
}

const START_DAY = dayNumber(new Date(2026, 9, 19)); // Oct 19, 2026 (local)

export function phaseForWeek(week: number): 1 | 2 | 3 | 4 {
  if (week <= 6) return 1;
  if (week <= 12) return 2;
  if (week <= 17) return 3;
  return 4;
}

export function cohortStatus(now: Date): CohortStatus {
  const days = dayNumber(now) - START_DAY;
  if (days < 0) return { kind: 'before', daysUntilStart: -days };
  const week = Math.floor(days / 7) + 1;
  if (week <= 20) return { kind: 'week', week, phase: phaseForWeek(week) };
  if (week === 21) return { kind: 'taper' };
  if (week === 22) return { kind: 'race' };
  return { kind: 'done' };
}
