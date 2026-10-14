/**
 * Unit tests for the Halloween Math Hunt question set.
 *
 * The set is the heart of the feature: 12 original problems, every one a
 * valid 5-choice problem, and the answer key below is the hand-verified
 * key from the build prep (2026-10-13) — if an option order ever changes,
 * these tests force a conscious re-check of the key.
 */
import { describe, expect, it } from 'vitest';
import {
  getOnlineQuestions,
  getPrintOnlyQuestions,
  HALLOWEEN_QUESTIONS,
  ONLINE_IDS,
  scoreHunt,
} from './questions';

const EXPECTED_ANSWERS: Record<string, number> = {
  'hw-01': 2, // C — 42
  'hw-02': 0, // A — 35
  'hw-03': 1, // B — 32
  'hw-04': 3, // D — 18
  'hw-05': 2, // C — 40
  'hw-06': 3, // D — 5:15 PM
  'hw-07': 1, // B — 38
  'hw-08': 0, // A — the white one
  'hw-09': 2, // C — 13 dollars
  'hw-10': 3, // D — 27
  'hw-11': 1, // B — 48
  'hw-12': 0, // A — 18
};

describe('halloween question set integrity', () => {
  it('has exactly 12 problems', () => {
    expect(HALLOWEEN_QUESTIONS).toHaveLength(12);
  });

  it('uses unique ids', () => {
    const ids = HALLOWEEN_QUESTIONS.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every problem is a valid 5-choice problem', () => {
    for (const q of HALLOWEEN_QUESTIONS) {
      expect(q.options, q.id).toHaveLength(5);
      expect(q.answer, q.id).toBeGreaterThanOrEqual(0);
      expect(q.answer, q.id).toBeLessThanOrEqual(4);
      expect(q.options[q.answer].length, q.id).toBeGreaterThan(0);
      expect(new Set(q.options).size, q.id).toBe(5);
    }
  });

  it('every problem has a real explanation and a valid tier', () => {
    for (const q of HALLOWEEN_QUESTIONS) {
      expect(q.explanation.trim().length, q.id).toBeGreaterThan(10);
      expect([3, 4, 5], q.id).toContain(q.points);
    }
  });

  it('keeps the 3/4/5 point mix: five 3s, four 4s, three 5s', () => {
    const count = (p: number) =>
      HALLOWEEN_QUESTIONS.filter((q) => q.points === p).length;
    expect(count(3)).toBe(5);
    expect(count(4)).toBe(4);
    expect(count(5)).toBe(3);
  });

  it('matches the hand-verified answer key', () => {
    for (const q of HALLOWEEN_QUESTIONS) {
      expect(q.answer, q.id).toBe(EXPECTED_ANSWERS[q.id]);
    }
    // Balanced key: three As, three Bs, three Cs, three Ds, no Es.
    const letters = HALLOWEEN_QUESTIONS.map((q) => q.answer);
    for (const idx of [0, 1, 2, 3]) {
      expect(letters.filter((a) => a === idx)).toHaveLength(3);
    }
    expect(letters.filter((a) => a === 4)).toHaveLength(0);
  });
});

describe('online vs print split', () => {
  it('has 6 online and 6 print-only problems', () => {
    expect(getOnlineQuestions()).toHaveLength(6);
    expect(getPrintOnlyQuestions()).toHaveLength(6);
    expect(getOnlineQuestions().map((q) => q.id)).toEqual(ONLINE_IDS);
  });

  it('online and print share the same objects (one answer key)', () => {
    for (const q of getOnlineQuestions()) {
      expect(HALLOWEEN_QUESTIONS).toContain(q);
    }
  });
});

describe('scoreHunt', () => {
  const online = getOnlineQuestions();

  it('scores a perfect hunt at full points', () => {
    const picks = Object.fromEntries(online.map((q) => [q.id, q.answer]));
    const s = scoreHunt(online, picks);
    expect(s.correctCount).toBe(6);
    expect(s.earned).toBe(s.possible);
    expect(s.possible).toBe(3 + 3 + 4 + 4 + 5 + 5);
  });

  it('scores unanswered problems as zero', () => {
    const s = scoreHunt(online, {});
    expect(s.earned).toBe(0);
    expect(s.correctCount).toBe(0);
  });
});
