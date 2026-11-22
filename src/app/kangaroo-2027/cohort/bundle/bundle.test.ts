/**
 * Guards for the 5-Week Cohort Bundle data (bundle.ts): the pack must
 * stay 5 weeks × 3 problems, points must run 3/4/5 in each week, every
 * problem must carry a hint, an answer and an explanation — and the
 * checkable answers must match independent arithmetic, so a typo in the
 * data fails CI instead of shipping a wrong answer key to families.
 */
import { BUNDLE_PROBLEM_COUNT, BUNDLE_WEEKS } from './bundle';

describe('cohort bundle data', () => {
  it('covers exactly 5 weeks with 3 problems each', () => {
    expect(BUNDLE_WEEKS).toHaveLength(5);
    expect(BUNDLE_WEEKS.map((w) => w.week)).toEqual([1, 2, 3, 4, 5]);
    for (const week of BUNDLE_WEEKS) {
      expect(week.problems).toHaveLength(3);
      expect(week.theme).toBeTruthy();
      expect(week.datesLabel).toBeTruthy();
    }
    expect(BUNDLE_PROBLEM_COUNT).toBe(15);
  });

  it('runs 3/4/5 points in order every week, with hint + answer + explanation', () => {
    for (const week of BUNDLE_WEEKS) {
      expect(week.problems.map((p) => p.points)).toEqual([3, 4, 5]);
      for (const p of week.problems) {
        expect(p.question.trim().length).toBeGreaterThan(20);
        expect(p.hint.trim()).toBeTruthy();
        expect(p.answer.trim()).toBeTruthy();
        expect(p.explanation.trim()).toBeTruthy();
      }
    }
  });

  it('matches independently computed answers', () => {
    const byWeek = new Map(BUNDLE_WEEKS.map((w) => [w.week, w.problems]));
    // Week 1 (Think Backwards): (26−6)/2, (7+3)×2, (8×2+5)/3.
    expect(byWeek.get(1)![0].answer).toBe(String((26 - 6) / 2));
    expect(byWeek.get(1)![1].answer).toBe(`$${(7 + 3) * 2}`);
    expect(byWeek.get(1)![2].answer).toBe(String((8 * 2 + 5) / 3));
    // Week 2 (Logic): 2nd from front + 4th from back → 2+4−1.
    expect(byWeek.get(2)![0].answer).toBe(String(2 + 4 - 1));
    // Week 3 (Weighing): 200 g / 2 apples; 2 × 3 × 100 g.
    expect(byWeek.get(3)![0].answer).toBe(`${200 / 2} g`);
    expect(byWeek.get(3)![1].answer).toBe(`${2 * 3 * 100} g`);
    // Week 4 (Counting): 3×2 outfits; triangular number 7×8/2; 5×4/2 handshakes.
    expect(byWeek.get(4)![0].answer).toBe(`${3 * 2} outfits`);
    expect(byWeek.get(4)![1].answer).toBe(`${(7 * 8) / 2} dots`);
    expect(byWeek.get(4)![2].answer).toBe(`${(5 * 4) / 2} handshakes`);
    // Week 5 (Shapes): 4 folds; 6×4 − 6×1; 12 cube edges.
    expect(byWeek.get(5)![0].answer).toBe('4 ways');
    expect(byWeek.get(5)![1].answer).toBe(`${6 * 4 - 6 * 1} cm²`);
    expect(byWeek.get(5)![2].answer).toBe('12 cubes');
  });
});
