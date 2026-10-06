/**
 * Unit tests for the 5-Day Math Challenge Pack selection.
 *
 * The pack references problems from the shared question bank by ID; these
 * tests make sure all five picks still exist, still ramp easy → hard, and
 * still carry everything the print pages need (5 options + explanation).
 */
import { describe, expect, it } from 'vitest';
import { PACK_QUESTION_IDS, getPackQuestions } from './pack';

describe('5-Day Challenge Pack selection', () => {
  it('resolves all five problems from the bank', () => {
    const questions = getPackQuestions();
    expect(questions).toHaveLength(PACK_QUESTION_IDS.length);
    expect(questions.map((q) => q.id)).toEqual([...PACK_QUESTION_IDS]);
  });

  it('ramps easy to hard across the week (3, 3, 4, 4, 5 points)', () => {
    const points = getPackQuestions().map((q) => q.points);
    expect(points).toEqual([3, 3, 4, 4, 5]);
  });

  it('every problem is printable: 5 options, a valid answer, an explanation', () => {
    for (const q of getPackQuestions()) {
      expect(q.options).toHaveLength(5);
      expect(q.answer).toBeGreaterThanOrEqual(0);
      expect(q.answer).toBeLessThan(5);
      expect(q.question.length).toBeGreaterThan(0);
      expect(q.explanation.length).toBeGreaterThan(0);
    }
  });
});
