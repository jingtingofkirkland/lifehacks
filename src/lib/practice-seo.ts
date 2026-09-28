/**
 * Practice-problem SEO pages (the "题库 SEO" experiment).
 *
 * Turns the 40 original Kangaroo-style questions in
 * src/app/tools/kangaroo/questions.ts into 40 statically generated,
 * individually indexable practice pages:
 *
 *   /practice/kangaroo/grade-3/<topic-slug>/
 *   /practice/kangaroo/grade-4/<topic-slug>/
 *
 * Grade mapping: 3-point (easy) questions -> grade-3, 4/5-point -> grade-4.
 * Each page carries Google "Practice problems" structured data
 * (Quiz > Question > Answer) so it is eligible for the Practice problems
 * rich result. See:
 * https://developers.google.com/search/docs/appearance/structured-data/practice-problems
 *
 * The question bank only contains original problems written in the
 * Kangaroo spirit (never past contest questions); every generated page
 * repeats the no-affiliation disclaimer.
 */
import {
  QUESTION_BANK,
  type KangarooQuestion,
} from '@/app/tools/kangaroo/questions';

export type PracticeGrade = 'grade-3' | 'grade-4';

export const SITE_ORIGIN = 'https://lifehacks.zeey-app.net';

/** Stable, human-readable topic slugs, one per question id. */
export const PRACTICE_SLUGS: Record<string, string> = {
  'k34-001': 'maya-stickers-addition',
  'k34-002': 'kangaroo-hops-multiplication',
  'k34-003': 'even-numbers',
  'k34-004': 'tom-marbles-subtraction',
  'k34-005': 'hexagon-sides',
  'k34-006': 'adding-three-fives',
  'k34-007': 'days-in-three-weeks',
  'k34-008': 'largest-number',
  'k34-009': 'lily-reading-pages',
  'k34-010': 'half-of-18',
  'k34-011': 'number-pattern-2-4-6-8',
  'k34-012': 'pizza-slices-left',
  'k34-013': 'subtract-36-minus-9',
  'k34-014': 'triangles-sides-counting',
  'k34-015': 'shape-with-no-corners',
  'k34-016': 'ben-sister-age',
  'k34-017': 'movie-end-time',
  'k34-018': 'change-from-5-dollars',
  'k34-019': 'number-pattern-5-10-20-40',
  'k34-020': 'tables-for-24-kids',
  'k34-021': 'square-perimeter-side',
  'k34-022': 'frog-jumps-multiples',
  'k34-023': 'mia-twice-apples',
  'k34-024': 'not-multiple-of-3',
  'k34-025': 'rectangle-area',
  'k34-026': 'subtract-100-minus-37',
  'k34-027': 'share-18-cookies',
  'k34-028': 'half-past-3',
  'k34-029': 'mystery-2-digit-number',
  'k34-030': 'multiply-7-times-8',
  'k34-031': 'kids-in-line-logic',
  'k34-032': 'ice-cream-combinations',
  'k34-033': 'balance-scale-apples-plums',
  'k34-034': 'may-calendar-day-of-week',
  'k34-035': 'snail-climbs-wall',
  'k34-036': 'matchstick-figures-pattern',
  'k34-037': 'boxes-bags-candies',
  'k34-038': 'leo-mystery-number',
  'k34-039': 'three-consecutive-numbers',
  'k34-040': 'zoe-reading-book-days',
};

/** Short kid-friendly display titles, one per question id. */
export const PRACTICE_TITLES: Record<string, string> = {
  'k34-001': "Maya's Stickers",
  'k34-002': 'Kangaroo Hops',
  'k34-003': 'Which Number Is Even?',
  'k34-004': "Tom's Marbles",
  'k34-005': 'Hexagon Sides',
  'k34-006': 'Adding Three Fives',
  'k34-007': 'Days in Three Weeks',
  'k34-008': 'The Largest Number',
  'k34-009': "Lily's Reading",
  'k34-010': 'Half of 18',
  'k34-011': 'Number Pattern: 2, 4, 6, 8…',
  'k34-012': 'Pizza Slices Left',
  'k34-013': '36 − 9',
  'k34-014': 'Counting Triangle Sides',
  'k34-015': 'Shape With No Corners',
  'k34-016': "Ben's Sister's Age",
  'k34-017': 'When Does the Movie End?',
  'k34-018': 'Change From $5',
  'k34-019': 'Number Pattern: 5, 10, 20, 40…',
  'k34-020': 'Tables for 24 Kids',
  'k34-021': 'Square Perimeter',
  'k34-022': 'Frog Jumps',
  'k34-023': "Mia's Apples",
  'k34-024': 'Not a Multiple of 3',
  'k34-025': 'Rectangle Area',
  'k34-026': '100 − 37',
  'k34-027': 'Sharing 18 Cookies',
  'k34-028': 'Half Past 3',
  'k34-029': 'Mystery 2-Digit Number',
  'k34-030': '7 × 8',
  'k34-031': 'Kids in Line',
  'k34-032': 'Ice-Cream Combinations',
  'k34-033': 'Balance Scale',
  'k34-034': 'May Calendar Puzzle',
  'k34-035': 'Snail Climbs the Wall',
  'k34-036': 'Matchstick Figures',
  'k34-037': 'Boxes, Bags, and Candies',
  'k34-038': "Leo's Mystery Number",
  'k34-039': 'Three Consecutive Numbers',
  'k34-040': "Zoe's Reading Plan",
};

export interface PracticeProblem {
  grade: PracticeGrade;
  gradeLabel: string;
  slug: string;
  title: string;
  question: KangarooQuestion;
  /** Site-relative path, e.g. /practice/kangaroo/grade-3/maya-stickers-addition/ */
  path: string;
  /** Absolute canonical URL. */
  url: string;
}

export function gradeForQuestion(q: KangarooQuestion): PracticeGrade {
  return q.points === 3 ? 'grade-3' : 'grade-4';
}

export function gradeLabel(grade: PracticeGrade): string {
  return grade === 'grade-3' ? 'Grade 3' : 'Grade 4';
}

function toPracticeProblem(q: KangarooQuestion): PracticeProblem {
  const grade = gradeForQuestion(q);
  const slug = PRACTICE_SLUGS[q.id];
  if (!slug) throw new Error(`practice-seo: no slug for question ${q.id}`);
  const title = PRACTICE_TITLES[q.id] ?? q.id;
  const path = `/practice/kangaroo/${grade}/${slug}/`;
  return {
    grade,
    gradeLabel: gradeLabel(grade),
    slug,
    title,
    question: q,
    path,
    url: `${SITE_ORIGIN}${path}`,
  };
}

/** All 40 problems as practice pages, sorted by question id. */
export function allPracticeProblems(): PracticeProblem[] {
  return QUESTION_BANK['grades-3-4']
    .map(toPracticeProblem)
    .sort((a, b) => a.question.id.localeCompare(b.question.id));
}

export function practiceProblemsForGrade(
  grade: PracticeGrade,
): PracticeProblem[] {
  return allPracticeProblems().filter((p) => p.grade === grade);
}

export function findPracticeProblem(
  grade: PracticeGrade,
  slug: string,
): PracticeProblem | undefined {
  return practiceProblemsForGrade(grade).find((p) => p.slug === slug);
}

export function metaTitle(p: PracticeProblem): string {
  return `${p.title} | ${p.gradeLabel} Kangaroo-Style Math Practice`;
}

export function metaDescription(p: PracticeProblem): string {
  const q = p.question.question.replace(/\s+/g, ' ').trim();
  const snippet = q.length > 120 ? `${q.slice(0, 117)}…` : q;
  return (
    `Free ${p.gradeLabel.toLowerCase()} Math Kangaroo-style practice problem ` +
    `(${p.question.category}, ${p.question.points} points): ${snippet} ` +
    `Solve it, then reveal the answer and step-by-step explanation.`
  );
}

/**
 * Google "Practice problems" rich-result limits for text-only problems:
 * question ≤ 320 chars, each answer ≤ 70 chars. Pages outside these limits
 * are still valid schema.org, just not eligible for the rich result.
 */
export function fitsRichResultLimits(q: KangarooQuestion): boolean {
  if (q.question.length > 320) return false;
  return q.options.every((opt) => opt.length <= 70);
}

/**
 * Build the JSON-LD for Google's Practice problems (Quiz) structured data.
 * Follows https://developers.google.com/search/docs/appearance/structured-data/practice-problems
 * Required: Quiz.name, hasPart (Question) with about, acceptedAnswer,
 * eduQuestionType, learningResourceType, suggestedAnswer, text.
 */
export function buildQuizJsonLd(p: PracticeProblem): Record<string, unknown> {
  const q = p.question;
  const gradeNum = p.grade === 'grade-3' ? '3' : '4';
  const distractors = q.options
    .map((text, position) => ({ text, position }))
    .filter(({ position }) => position !== q.answer);
  return {
    '@context': 'https://schema.org/',
    '@type': 'Quiz',
    name: `${p.title} — ${p.gradeLabel} Kangaroo-Style Practice Problem`,
    about: { '@type': 'Thing', name: q.category },
    educationalLevel: 'beginner',
    educationalAlignment: [
      {
        '@type': 'AlignmentObject',
        alignmentType: 'educationalSubject',
        targetName: 'Mathematics',
      },
      {
        '@type': 'AlignmentObject',
        alignmentType: 'educationalLevel',
        targetName: `Grade ${gradeNum}`,
      },
    ],
    hasPart: {
      '@type': 'Question',
      eduQuestionType: 'Multiple choice',
      learningResourceType: 'Practice problem',
      name: p.title,
      text: q.question,
      typicalAgeRange: '8-10',
      about: { '@type': 'Thing', name: q.category },
      acceptedAnswer: {
        '@type': 'Answer',
        position: q.answer,
        text: q.options[q.answer],
        answerExplanation: {
          '@type': 'Comment',
          text: q.explanation,
        },
      },
      suggestedAnswer: distractors.map(({ text, position }) => ({
        '@type': 'Answer',
        position,
        text,
      })),
    },
  };
}
