/**
 * Data-integrity tests for the 2026 calendar's holiday dataset.
 *
 * The calendar renders directly from HOLIDAYS; a typo'd date (e.g. 2026-02-30)
 * or a duplicate would silently mis-render. These tests validate every entry.
 */
import { describe, expect, it } from 'vitest';
import { HOLIDAYS } from './holidays';

describe('2026 holiday data', () => {
  it('every entry has a real calendar date in 2026', () => {
    expect(HOLIDAYS.length).toBeGreaterThan(0);

    for (const h of HOLIDAYS) {
      expect(h.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);

      // Round-trip through Date to catch impossible dates like 2026-02-30.
      const parsed = new Date(`${h.date}T00:00:00`);
      expect(Number.isNaN(parsed.getTime())).toBe(false);
      expect(parsed.toISOString().slice(0, 10)).toBe(h.date);

      expect(h.date.startsWith('2026-')).toBe(true);
      expect(h.name.trim().length).toBeGreaterThan(0);
      expect(h.color.trim().length).toBeGreaterThan(0);
    }
  });

  it('has no duplicate dates', () => {
    const dates = HOLIDAYS.map((h) => h.date);
    expect(new Set(dates).size).toBe(dates.length);
  });

  it('marks the major US holidays as days off', () => {
    const byDate = new Map(HOLIDAYS.map((h) => [h.date, h]));

    const expected: Array<[string, string]> = [
      ['2026-01-01', "New Year's Day"],
      ['2026-07-04', 'Independence Day'],
      ['2026-11-26', 'Thanksgiving'],
      ['2026-12-25', 'Christmas Day'],
    ];

    for (const [date, name] of expected) {
      expect(byDate.get(date)?.name).toBe(name);
      expect(byDate.get(date)?.dayOff).toBe(true);
    }
  });
});
