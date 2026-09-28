/**
 * Unit tests for the practice-problem SEO pages (src/lib/practice-seo.ts).
 *
 * These lock in the experiment's invariants: every one of the 40 bank
 * questions gets exactly one stable, unique URL; the grade split is
 * 17 (3pt) / 23 (4&5pt); and every page's JSON-LD carries the properties
 * Google requires for the Practice problems rich result.
 */
import { describe, expect, it } from 'vitest';
import { QUESTION_BANK } from '@/app/tools/kangaroo/questions';
import {
  allPracticeProblems,
  buildQuizJsonLd,
  fitsRichResultLimits,
  findPracticeProblem,
  gradeForQuestion,
  metaDescription,
  metaTitle,
  practiceProblemsForGrade,
  PRACTICE_SLUGS,
  PRACTICE_TITLES,
} from './practice-seo';

const BANK = QUESTION_BANK['grades-3-4'];

describe('practice-seo slugs and grade split', () => {
  it('covers all 40 bank questions with a slug and a title', () => {
    expect(BANK).toHaveLength(40);
    for (const q of BANK) {
      expect(PRACTICE_SLUGS[q.id], `slug for ${q.id}`).toMatch(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      );
      expect(PRACTICE_TITLES[q.id], `title for ${q.id}`).toBeTruthy();
    }
  });

  it('produces 40 unique stable paths', () => {
    const problems = allPracticeProblems();
    expect(problems).toHaveLength(40);
    const paths = problems.map((p) => p.path);
    expect(new Set(paths).size).toBe(40);
    for (const p of problems) {
      expect(p.path).toBe(
        `/practice/kangaroo/${p.grade}/${p.slug}/`,
      );
      expect(p.url).toBe(`https://lifehacks.zeey-app.net${p.path}`);
    }
  });

  it('splits 3-point questions to grade-3 and the rest to grade-4', () => {
    expect(practiceProblemsForGrade('grade-3')).toHaveLength(16);
    expect(practiceProblemsForGrade('grade-4')).toHaveLength(24);
    for (const q of BANK) {
      const expected = q.points === 3 ? 'grade-3' : 'grade-4';
      expect(gradeForQuestion(q)).toBe(expected);
    }
  });

  it('round-trips every slug through findPracticeProblem', () => {
    for (const p of allPracticeProblems()) {
      expect(findPracticeProblem(p.grade, p.slug)?.question.id).toBe(
        p.question.id,
      );
    }
    expect(findPracticeProblem('grade-3', 'no-such-slug')).toBeUndefined();
    // A grade-4 slug must not resolve under grade-3.
    const g4 = practiceProblemsForGrade('grade-4')[0];
    expect(findPracticeProblem('grade-3', g4.slug)).toBeUndefined();
  });
});

describe('practice-seo metadata', () => {
  it('builds non-empty titles and descriptions mentioning the grade', () => {
    for (const p of allPracticeProblems()) {
      const title = metaTitle(p);
      const desc = metaDescription(p);
      expect(title).toContain(p.title);
      expect(title).toContain(p.gradeLabel);
      expect(desc.toLowerCase()).toContain(p.gradeLabel.toLowerCase());
      expect(desc).toContain(p.question.category);
      expect(desc.length).toBeGreaterThan(50);
    }
  });
});

describe('practice-seo rich-result limits', () => {
  it('keeps every question within Google text-only limits (320/70)', () => {
    for (const q of BANK) {
      expect(fitsRichResultLimits(q), q.id).toBe(true);
    }
  });
});

describe('practice-seo Quiz JSON-LD', () => {
  it('includes every property Google requires for Practice problems', () => {
    for (const p of allPracticeProblems()) {
      const jsonLd = buildQuizJsonLd(p) as Record<string, any>;
      expect(jsonLd['@type']).toBe('Quiz');
      expect(jsonLd.name).toBeTruthy();
      expect(jsonLd.about?.name).toBe(p.question.category);

      const part = jsonLd.hasPart;
      expect(part['@type']).toBe('Question');
      expect(part.eduQuestionType).toBe('Multiple choice');
      expect(part.learningResourceType).toBe('Practice problem');
      expect(part.text).toBe(p.question.question);
      expect(part.about?.name).toBe(p.question.category);

      // The accepted answer is the bank's correct option…
      expect(part.acceptedAnswer['@type']).toBe('Answer');
      expect(part.acceptedAnswer.position).toBe(p.question.answer);
      expect(part.acceptedAnswer.text).toBe(
        p.question.options[p.question.answer],
      );
      expect(part.acceptedAnswer.answerExplanation.text).toBe(
        p.question.explanation,
      );

      // …and the distractors are the other four options, in order.
      const suggested = part.suggestedAnswer;
      expect(suggested).toHaveLength(4);
      const expectedDistractors = p.question.options.filter(
        (_, i) => i !== p.question.answer,
      );
      expect(suggested.map((a: any) => a.text)).toEqual(expectedDistractors);
      expect(
        suggested.map((a: any) => a.position).sort((a: number, b: number) => a - b),
      ).toEqual(
        p.question.options
          .map((_, i) => i)
          .filter((i) => i !== p.question.answer),
      );
    }
  });

  it('serializes to JSON without throwing', () => {
    for (const p of allPracticeProblems()) {
      expect(() => JSON.stringify(buildQuizJsonLd(p))).not.toThrow();
    }
  });
});
