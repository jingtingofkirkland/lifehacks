import { describe, expect, it } from 'vitest';
import { cohortStatus, phaseForWeek, PHASES } from './cohort';

/** Local-midnight Date from an ISO day, matching how cohort.ts reads it. */
function d(iso: string): Date {
  const [y, m, day] = iso.split('-').map(Number);
  return new Date(y, m - 1, day);
}

describe('cohort calendar (IDEA-20261012-01)', () => {
  it('is in pre-start before Monday of Week 1, counting down days', () => {
    expect(cohortStatus(d('2026-10-16'))).toEqual({
      kind: 'before',
      daysUntilStart: 3,
    });
    expect(cohortStatus(d('2026-10-18'))).toEqual({
      kind: 'before',
      daysUntilStart: 1,
    });
  });

  it('starts Week 1 / Phase 1 on Oct 19, 2026 and holds it through Sunday', () => {
    expect(cohortStatus(d('2026-10-19'))).toEqual({
      kind: 'week',
      week: 1,
      phase: 1,
    });
    expect(cohortStatus(d('2026-10-25'))).toEqual({
      kind: 'week',
      week: 1,
      phase: 1,
    });
    expect(cohortStatus(d('2026-10-26'))).toEqual({
      kind: 'week',
      week: 2,
      phase: 1,
    });
  });

  it('crosses into Phase 2 at Week 7 (Nov 30, 2026)', () => {
    expect(cohortStatus(d('2026-11-29'))).toEqual({
      kind: 'week',
      week: 6,
      phase: 1,
    });
    expect(cohortStatus(d('2026-11-30'))).toEqual({
      kind: 'week',
      week: 7,
      phase: 2,
    });
    // Registration deadline day itself is still Week 11.
    expect(cohortStatus(d('2026-12-31'))).toEqual({
      kind: 'week',
      week: 11,
      phase: 2,
    });
  });

  it('crosses into Phase 3 at Week 13 (Jan 11, 2027)', () => {
    expect(cohortStatus(d('2027-01-10'))).toEqual({
      kind: 'week',
      week: 12,
      phase: 2,
    });
    expect(cohortStatus(d('2027-01-11'))).toEqual({
      kind: 'week',
      week: 13,
      phase: 3,
    });
    // Late registration closes Feb 1, inside Week 16 / Phase 3.
    expect(cohortStatus(d('2027-02-01'))).toEqual({
      kind: 'week',
      week: 16,
      phase: 3,
    });
  });

  it('crosses into Phase 4 at Week 18 (Feb 15, 2027)', () => {
    expect(cohortStatus(d('2027-02-14'))).toEqual({
      kind: 'week',
      week: 17,
      phase: 3,
    });
    expect(cohortStatus(d('2027-02-15'))).toEqual({
      kind: 'week',
      week: 18,
      phase: 4,
    });
    expect(cohortStatus(d('2027-03-07'))).toEqual({
      kind: 'week',
      week: 20,
      phase: 4,
    });
  });

  it('runs taper week, then race week containing contest day Mar 18, then done', () => {
    expect(cohortStatus(d('2027-03-08'))).toEqual({ kind: 'taper' });
    expect(cohortStatus(d('2027-03-14'))).toEqual({ kind: 'taper' });
    expect(cohortStatus(d('2027-03-15'))).toEqual({ kind: 'race' });
    expect(cohortStatus(d('2027-03-18'))).toEqual({ kind: 'race' });
    expect(cohortStatus(d('2027-03-21'))).toEqual({ kind: 'race' });
    expect(cohortStatus(d('2027-03-22'))).toEqual({ kind: 'done' });
  });

  it('time of day never shifts a week boundary', () => {
    const lateSunday = new Date(2026, 9, 25, 23, 59);
    expect(cohortStatus(lateSunday)).toEqual({
      kind: 'week',
      week: 1,
      phase: 1,
    });
  });

  it('phaseForWeek covers all 20 weeks', () => {
    expect([1, 6, 7, 12, 13, 17, 18, 20].map(phaseForWeek)).toEqual([
      1, 1, 2, 2, 3, 3, 4, 4,
    ]);
  });

  it('ships exactly four phases whose assets and actions are all present', () => {
    expect(PHASES.map((p) => p.id)).toEqual([1, 2, 3, 4]);
    for (const phase of PHASES) {
      expect(phase.assets.length).toBeGreaterThanOrEqual(3);
      expect(phase.actions.length).toBe(3);
      for (const asset of phase.assets) {
        expect(asset.href.startsWith('/')).toBe(true);
      }
    }
  });
});
