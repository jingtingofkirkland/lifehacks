import { describe, expect, it } from 'vitest';
import {
  READINESS_QUESTION_IDS,
  buildPracticePlan,
  readinessQuestions,
  recommendedPractice,
  summarizeTopics,
  topicVerdict,
} from './readiness';

const answersFor = (correctIds: Set<string>) =>
  readinessQuestions().map((q) => (correctIds.has(q.id) ? q.answer : (q.answer + 1) % q.options.length));

describe('readiness question selection', () => {
  it('picks 9 questions, 3 per point tier, covering all six categories', () => {
    const questions = readinessQuestions();
    expect(questions).toHaveLength(9);
    for (const tier of [3, 4, 5]) {
      expect(questions.filter((q) => q.points === tier)).toHaveLength(3);
    }
    const categories = new Set(questions.map((q) => q.category));
    expect(categories).toEqual(
      new Set(['Arithmetic', 'Patterns', 'Geometry', 'Logic', 'Time & Money', 'Word Problems']),
    );
  });

  it('uses unique bank question ids', () => {
    expect(new Set(READINESS_QUESTION_IDS).size).toBe(9);
  });
});

describe('summarizeTopics', () => {
  it('reports a perfect run as all strong with full points', () => {
    const questions = readinessQuestions();
    const stats = summarizeTopics(questions, answersFor(new Set(READINESS_QUESTION_IDS)));
    expect(stats.every((s) => topicVerdict(s) === 'strong')).toBe(true);
    expect(stats.reduce((n, s) => n + s.points, 0)).toBe(36);
    expect(stats.reduce((n, s) => n + s.maxPoints, 0)).toBe(36);
  });

  it('sorts weakest topics first and scores points per topic', () => {
    const questions = readinessQuestions();
    // Only the two 3-point Arithmetic/Word-Problems questions correct.
    const stats = summarizeTopics(questions, answersFor(new Set(['k34-001', 'k34-016'])));
    expect(stats[0].correct).toBe(0);
    const arithmetic = stats.find((s) => s.category === 'Arithmetic');
    expect(arithmetic).toMatchObject({ total: 1, correct: 1, points: 3, maxPoints: 3 });
  });

  it('treats unanswered questions as incorrect', () => {
    const questions = readinessQuestions();
    const stats = summarizeTopics(questions, questions.map(() => null));
    expect(stats.every((s) => s.correct === 0)).toBe(true);
  });
});

describe('recommendedPractice', () => {
  it('suggests non-diagnostic questions for weak topics only', () => {
    const questions = readinessQuestions();
    const stats = summarizeTopics(questions, answersFor(new Set(['k34-001', 'k34-016'])));
    const picks = recommendedPractice(stats);
    expect(picks.length).toBeGreaterThan(0);
    for (const pick of picks) {
      expect(pick.problems.length).toBeGreaterThan(0);
      expect(pick.problems.length).toBeLessThanOrEqual(3);
      for (const p of pick.problems) {
        expect(p.question.category).toBe(pick.category);
        expect(READINESS_QUESTION_IDS).not.toContain(p.question.id);
      }
    }
    // Arithmetic was answered correctly, so it needs no practice picks.
    expect(picks.map((p) => p.category)).not.toContain('Arithmetic');
  });
});

describe('buildPracticePlan', () => {
  it('always returns 4 weeks, weakest topic first', () => {
    const questions = readinessQuestions();
    const stats = summarizeTopics(questions, answersFor(new Set()));
    const plan = buildPracticePlan(stats);
    expect(plan).toHaveLength(4);
    expect(plan.map((w) => w.week)).toEqual([1, 2, 3, 4]);
    expect(plan[0].title).toContain(stats[0].category);
    for (const week of plan) expect(week.tasks.length).toBeGreaterThanOrEqual(3);
  });

  it('still returns a sensible plan for a perfect score', () => {
    const questions = readinessQuestions();
    const stats = summarizeTopics(questions, answersFor(new Set(READINESS_QUESTION_IDS)));
    const plan = buildPracticePlan(stats);
    expect(plan).toHaveLength(4);
    expect(plan[3].tasks.join(' ')).toMatch(/retake/i);
  });
});
