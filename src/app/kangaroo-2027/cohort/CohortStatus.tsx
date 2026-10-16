'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { cohortStatus, PHASES, type CohortStatus as Status } from './cohort';

function bannerText(status: Status): { headline: string; sub: string; phaseId?: number } {
  switch (status.kind) {
    case 'before':
      return {
        headline: `Week 1 starts Monday, October 19, 2026 — in ${status.daysUntilStart} day${status.daysUntilStart === 1 ? '' : 's'}`,
        sub: 'Use this weekend to take the readiness check, so Week 1 starts with a baseline, not a guess.',
        phaseId: 1,
      };
    case 'week': {
      const phase = PHASES[status.phase - 1];
      return {
        headline: `You're in Week ${status.week} of 20 · Phase ${status.phase} — ${phase.title}`,
        sub: `This phase (${phase.weeksLabel}): ${phase.theme.charAt(0).toLowerCase()}${phase.theme.slice(1)}. First move: ${phase.actions[0]}`,
        phaseId: status.phase,
      };
    }
    case 'taper':
      return {
        headline: "It's taper week (Mar 8–14) — the work is done",
        sub: 'Light review only, early nights, and a calm run-up to contest day: Thursday, March 18, 2027.',
        phaseId: 4,
      };
    case 'race':
      return {
        headline: "It's contest week — Math Kangaroo is Thursday, March 18 🦘",
        sub: 'Confirm your center’s arrival time, lay out pencils and a water bottle, and let them sleep. Good luck!',
        phaseId: 4,
      };
    case 'done':
      return {
        headline: 'The 2027 contest is in the books 🎉',
        sub: 'Results usually reach families via their center in May. Thanks for running the cohort with us — see you next season.',
      };
  }
}

/**
 * Live "where are we in the cohort" banner. The cohort week is a pure
 * function of the visitor's calendar date (cohort.ts), computed on
 * the client after mount; the static export ships a neutral fallback
 * so the prerendered HTML never states a wrong week.
 */
export function CohortStatus() {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    setStatus(cohortStatus(new Date()));
  }, []);

  const text = status
    ? bannerText(status)
    : {
        headline: 'The cohort runs October 19, 2026 – March 18, 2027',
        sub: 'Twenty training weeks in four phases, ending at contest day on Thursday, March 18, 2027.',
        phaseId: undefined as number | undefined,
      };

  return (
    <div
      data-testid="cohort-status"
      className="rounded-2xl border border-orange-200 dark:border-orange-800/50 bg-orange-50 dark:bg-orange-950/30 p-6 mb-10"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
        📍 Where the cohort is now
      </p>
      <p className="font-bold text-lg mb-1">{text.headline}</p>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {text.sub}
        {text.phaseId ? (
          <>
            {' '}
            <Link
              href={`#phase-${text.phaseId}`}
              className="font-semibold text-primary hover:underline whitespace-nowrap"
            >
              Jump to this phase ↓
            </Link>
          </>
        ) : null}
      </p>
    </div>
  );
}
