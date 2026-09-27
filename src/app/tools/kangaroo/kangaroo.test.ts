/**
 * Unit tests for the Kangaroo prep question bank and selection logic.
 *
 * The bank is the heart of this feature, so the integrity checks are strict:
 * every question must be a valid 5-choice Kangaroo-style problem with a real
 * explanation. Selection must be deterministic (same day -> same content) and
 * the daily rotation must not repeat within a full cycle.
 */
import { describe, expect, it } from 'vitest';
import {
  dayNumber,
  getDailyQuestion,
  getQuizQuestions,
  QUESTION_BANK,
  scoreQuiz,
  seededRandom,
  type KangarooQuestion,
} from './questions';

const BAND = 'grades-3-4' as const;
const bank = QUESTION_BANK[BAND];

describe('question bank integrity', () => {
  it('has a healthy number of original questions', () => {
    expect(bank.length).toBeGreaterThanOrEqual(30);
  });

  it('uses unique ids', () => {
    const ids = bank.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every question is a valid 5-choice problem', () => {
    for (const q of bank) {
      expect(q.options, q.id).toHaveLength(5);
      expect(q.answer, q.id).toBeGreaterThanOrEqual(0);
      expect(q.answer, q.id).toBeLessThanOrEqual(4);
      expect(q.options[q.answer].length, q.id).toBeGreaterThan(0);
    }
  });

  it('every question has a non-empty explanation', () => {
    for (const q of bank) {
      expect(q.explanation.trim().length, q.id).toBeGreaterThan(10);
    }
  });

  it('every question has a valid point tier and grade band', () => {
    for (const q of bank) {
      expect([3, 4, 5], q.id).toContain(q.points);
      expect(q.gradeBand, q.id).toBe(BAND);
      expect(q.question.trim().length, q.id).toBeGreaterThan(10);
    }
  });

  it('covers all three difficulty tiers', () => {
    const tiers = new Set(bank.map((q) => q.points));
    expect(tiers).toEqual(new Set([3, 4, 5]));
  });

  it('answer options are not all identical', () => {
    for (const q of bank) {
      expect(new Set(q.options).size, q.id).toBeGreaterThan(1);
    }
  });
});

describe('dayNumber', () => {
  it('is stable for the same UTC day regardless of time', () => {
    const a = new Date(Date.UTC(2027, 2, 18, 0, 0, 1));
    const b = new Date(Date.UTC(2027, 2, 18, 23, 59, 59));
    expect(dayNumber(a)).toBe(dayNumber(b));
  });

  it('advances by exactly one per day', () => {
    const a = new Date(Date.UTC(2027, 2, 18, 12, 0, 0));
    const b = new Date(Date.UTC(2027, 2, 19, 12, 0, 0));
    expect(dayNumber(b) - dayNumber(a)).toBe(1);
  });
});

describe('getDailyQuestion', () => {
  it('returns the same question for the same date (deterministic)', () => {
    const d = new Date(Date.UTC(2027, 2, 18));
    expect(getDailyQuestion(BAND, d).id).toBe(getDailyQuestion(BAND, d).id);
  });

  it('does not repeat within a full rotation cycle', () => {
    const seen = new Set<string>();
    const start = new Date(Date.UTC(2027, 0, 1));
    for (let i = 0; i < bank.length; i++) {
      const d = new Date(start.getTime() + i * 86_400_000);
      seen.add(getDailyQuestion(BAND, d).id);
    }
    expect(seen.size).toBe(bank.length);
  });

  it('comes from the bank', () => {
    const q = getDailyQuestion(BAND, new Date(Date.UTC(2026, 9, 27)));
    expect(bank).toContain(q);
  });
});

describe('seededRandom', () => {
  it('produces the same sequence for the same seed', () => {
    const r1 = seededRandom(42);
    const r2 = seededRandom(42);
    expect([r1(), r1(), r1()]).toEqual([r2(), r2(), r2()]);
  });

  it('stays in [0, 1)', () => {
    const r = seededRandom(7);
    for (let i = 0; i < 100; i++) {
      const v = r();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe('getQuizQuestions', () => {
  it('returns 8 distinct questions by default', () => {
    const qs = getQuizQuestions(BAND);
    expect(qs).toHaveLength(8);
    expect(new Set(qs.map((q) => q.id)).size).toBe(8);
  });

  it('is deterministic for the same date (same quiz all day)', () => {
    const d = new Date(Date.UTC(2027, 2, 18, 9, 30));
    const a = getQuizQuestions(BAND, 8, undefined, d).map((q) => q.id);
    const b = getQuizQuestions(BAND, 8, undefined, d).map((q) => q.id);
    expect(a).toEqual(b);
  });

  it('an explicit seed shuffles differently', () => {
    const a = getQuizQuestions(BAND, 8, 1).map((q: KangarooQuestion) => q.id);
    const b = getQuizQuestions(BAND, 8, 2).map((q: KangarooQuestion) => q.id);
    // Astronomically unlikely to be equal with different seeds.
    expect(a).not.toEqual(b);
  });

  it('never returns more questions than the bank holds', () => {
    expect(getQuizQuestions(BAND, 9999)).toHaveLength(bank.length);
  });
});

describe('scoreQuiz', () => {
  const qs = bank.slice(0, 3);

  it('sums point values of correct answers only', () => {
    const allRight = qs.map((q) => q.answer);
    const r = scoreQuiz(qs, allRight);
    expect(r.earned).toBe(qs[0].points + qs[1].points + qs[2].points);
    expect(r.correctCount).toBe(3);
    expect(r.possible).toBe(r.earned);
  });

  it('treats wrong and unanswered as zero', () => {
    const wrongIdx = (qs[0].answer + 1) % 5;
    const r = scoreQuiz(qs, [wrongIdx, null, qs[2].answer]);
    expect(r.earned).toBe(qs[2].points);
    expect(r.correctCount).toBe(1);
    expect(r.possible).toBe(qs[0].points + qs[1].points + qs[2].points);
  });

  it('scores an empty quiz as zero', () => {
    expect(scoreQuiz([], [])).toEqual({
      earned: 0,
      possible: 0,
      correctCount: 0,
    });
  });
});
