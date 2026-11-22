/**
 * The 5-Week Cohort Bundle (IDEA-20261122-02): the first five weeks of
 * the Kangaroo 2027 companion cohort as one printable pack — 15 problems
 * (3 per week, 3/4/5 points), with hints on the sheets and a full
 * answer key at the end. Pure data so the page and the test share it.
 *
 * Sources, week by week:
 * - Week 1 (Think Backwards) reuses Weekly Worksheet Issue 2 (sent
 *   2026-10-16); answers were verified at send time (10 / $20 / 7).
 * - Week 3 (Weighing & Balance) reuses Issue 3 (sent 2026-11-06);
 *   answers verified at send time (100 g / 600 g / yes).
 * - Week 4 (Counting & Patterns) reuses Issue 4 (sent 2026-11-13);
 *   answers verified at send time (6 / 28 / 10).
 * - Weeks 2 (Logic & Reasoning) and 5 (Shapes & Symmetry) had no
 *   published weekly set — the newsletter never ran those weeks — so
 *   their problems were written for this bundle in the same format
 *   (3/4/5 pts, hint + answer + explanation) and verified in
 *   bundle.test.ts by independent arithmetic.
 */

export interface BundleProblem {
  points: 3 | 4 | 5;
  tag: string;
  question: string;
  hint: string;
  answer: string;
  explanation: string;
}

export interface BundleWeek {
  week: number;
  datesLabel: string;
  theme: string;
  intro: string;
  problems: BundleProblem[];
}

export const BUNDLE_WEEKS: BundleWeek[] = [
  {
    week: 1,
    datesLabel: 'Oct 19–25, 2026',
    theme: 'Think Backwards',
    intro:
      'Start from the end and work backwards — the skill third graders get stuck on most, and pure Math Kangaroo gold. From Weekly Worksheet Issue 2.',
    problems: [
      {
        points: 3,
        tag: 'Warm-up',
        question:
          'A mystery number is doubled, then 6 is added. The result is 26. What was the mystery number?',
        hint: 'Undo it step by step — subtract first, then halve.',
        answer: '10',
        explanation:
          'Work backwards: 26 − 6 = 20, and 20 ÷ 2 = 10. Check: 10 × 2 + 6 = 26.',
      },
      {
        points: 4,
        tag: 'Two-step',
        question:
          'Sofia spent half of her money on a book, then spent $3 on a snack. She has $7 left. How much money did she start with?',
        hint: 'Work backwards from the $7.',
        answer: '$20',
        explanation:
          'Before the snack she had $7 + $3 = $10 — that was half her money, so she started with $10 × 2 = $20.',
      },
      {
        points: 5,
        tag: 'Challenge',
        question:
          'Jake thought of a number. He multiplied it by 3, subtracted 5, then divided by 2 — and got 8. What number did Jake start with?',
        hint: 'Three steps to undo — start from 8 and reverse each one.',
        answer: '7',
        explanation:
          'Undo in reverse: 8 × 2 = 16, 16 + 5 = 21, 21 ÷ 3 = 7. Check: 7 × 3 − 5 = 16, and 16 ÷ 2 = 8.',
      },
    ],
  },
  {
    week: 2,
    datesLabel: 'Oct 26–Nov 1, 2026',
    theme: 'Logic & Reasoning',
    intro:
      'No calculating — just careful thinking. Test each possibility and let the clues do the work. Written for this bundle.',
    problems: [
      {
        points: 3,
        tag: 'Warm-up',
        question:
          'Mia stands in a line of kids. She is the 2nd from the front and the 4th from the back. How many kids are in the line?',
        hint: "Count the kids in front of Mia, then the kids behind her — and don't forget Mia herself.",
        answer: '5',
        explanation:
          '1 kid stands in front of Mia, 3 stand behind her, plus Mia herself: 1 + 1 + 3 = 5.',
      },
      {
        points: 4,
        tag: 'Two-step',
        question:
          "Three boxes sit on a table. One holds a gold coin, one holds a silver coin, one is empty. Box A says: 'The gold coin is in Box B.' Box B says: 'The gold coin is not in here.' Box C says: 'The gold coin is not in Box A.' Only one box tells the truth. Where is the gold coin?",
        hint: 'Test each box: pretend the coin is there, then count how many boxes tell the truth.',
        answer: 'Box A',
        explanation:
          'Try each hiding place. If the gold is in Box A, Box A lies, Box B tells the truth, and Box C lies — exactly one truth. If it is in Box B, two boxes tell the truth; if it is in Box C, two tell the truth. So the gold coin is in Box A.',
      },
      {
        points: 5,
        tag: 'Challenge',
        question:
          'Five kids — Alex, Bo, Cam, Dee, and Eli — each play a different sport: soccer, basketball, tennis, swimming, and running. Alex doesn’t play soccer or basketball. Bo plays a ball sport (soccer or basketball). Cam plays tennis. Dee doesn’t swim, and doesn’t play basketball. Eli plays running. Who plays soccer?',
        hint: 'Start with the two you know for sure — Cam and Eli — then see what is left for Alex.',
        answer: 'Dee',
        explanation:
          'Cam takes tennis and Eli takes running. Alex can’t play soccer or basketball, so Alex must swim. Dee doesn’t swim or play basketball, so Dee must play soccer — leaving basketball for Bo.',
      },
    ],
  },
  {
    week: 3,
    datesLabel: 'Nov 2–8, 2026',
    theme: 'Weighing & Balance',
    intro:
      'The puzzles where a scale does the thinking. From Weekly Worksheet Issue 3.',
    problems: [
      {
        points: 3,
        tag: 'Warm-up',
        question:
          'On a balance scale, 3 apples on the left balance exactly with 1 apple plus a 200 g weight on the right. How much does one apple weigh?',
        hint: 'Take one apple off both sides — what stays balanced?',
        answer: '100 g',
        explanation:
          'Take 1 apple off each side: 2 apples balance 200 g, so 1 apple weighs 100 g.',
      },
      {
        points: 4,
        tag: 'Two-step',
        question:
          'A watermelon balances exactly with 2 pineapples. One pineapple balances exactly with 3 oranges. If one orange weighs 100 g, how much does the watermelon weigh?',
        hint: 'Build the chain one balance at a time.',
        answer: '600 g',
        explanation:
          '1 pineapple = 3 oranges = 300 g, and the watermelon = 2 pineapples = 600 g.',
      },
      {
        points: 5,
        tag: 'Challenge',
        question:
          'There are 5 coins that look identical, but one is a fake — it is a little lighter than the others. Using a balance scale only twice, can you always find the fake coin?',
        hint: 'Don’t weigh all 5 at once — split them 2, 2, and 1.',
        answer: 'Yes — always in 2 weighings',
        explanation:
          'Weigh 2 coins against 2. If they balance, the coin left out is the fake. If not, weigh the 2 coins from the lighter side against each other — the lighter one is the fake.',
      },
    ],
  },
  {
    week: 4,
    datesLabel: 'Nov 9–15, 2026',
    theme: 'Counting & Patterns',
    intro:
      'Count cleverly instead of counting one by one. From Weekly Worksheet Issue 4.',
    problems: [
      {
        points: 3,
        tag: 'Warm-up',
        question:
          'Mia has 3 T-shirts — red, blue, and green — and 2 pairs of shorts — black and white. How many different outfits can she make by picking one T-shirt and one pair of shorts?',
        hint: 'Each T-shirt can pair with both pairs of shorts — count shirt by shirt.',
        answer: '6 outfits',
        explanation:
          'Each of the 3 T-shirts pairs with 2 pairs of shorts: 3 × 2 = 6.',
      },
      {
        points: 4,
        tag: 'Two-step',
        question:
          'Look at this dot pattern: Figure 1 has 1 dot, Figure 2 has 3 dots, Figure 3 has 6 dots, Figure 4 has 10 dots. How many dots does Figure 7 have?',
        hint: 'Look at how many dots are added each time — the added number grows by 1.',
        answer: '28 dots',
        explanation:
          'The figures add 2, then 3, then 4… Figure 5 has 15, Figure 6 has 21, Figure 7 has 28.',
      },
      {
        points: 5,
        tag: 'Challenge',
        question:
          'Five friends meet at a math club. Each pair of friends shakes hands exactly once. How many handshakes are there in total?',
        hint: 'Count how many new handshakes each friend makes — the last friend has already shaken everyone’s hand.',
        answer: '10 handshakes',
        explanation:
          'The first friend shakes 4 hands, the next 3 new ones, then 2, then 1: 4 + 3 + 2 + 1 = 10.',
      },
    ],
  },
  {
    week: 5,
    datesLabel: 'Nov 16–22, 2026',
    theme: 'Shapes & Symmetry',
    intro:
      'Fold it, cut it, count it — the puzzles where seeing beats calculating. Written for this bundle.',
    problems: [
      {
        points: 3,
        tag: 'Warm-up',
        question:
          'Mia folds a square piece of paper in half so the two halves match exactly. How many different ways can she fold it?',
        hint: 'Try folding it straight across — then try corner to corner.',
        answer: '4 ways',
        explanation:
          'Top to bottom, left to right, and the two diagonals — 4 folds in total.',
      },
      {
        points: 4,
        tag: 'Two-step',
        question:
          'A rectangle is 6 cm long and 4 cm wide. A 1 cm wide strip is cut off along the whole length. What is the area of the piece that is left?',
        hint: 'Work out the area of the whole rectangle first, then subtract the strip.',
        answer: '18 cm²',
        explanation:
          'The whole rectangle is 6 × 4 = 24 cm². The strip is 6 × 1 = 6 cm². What is left is 24 − 6 = 18 cm².',
      },
      {
        points: 5,
        tag: 'Challenge',
        question:
          'A cube is painted red on all its faces, then cut into 27 equal smaller cubes (3 along each edge). How many of the small cubes have paint on exactly 2 faces?',
        hint: 'Where must a cube sit to have paint on exactly two sides? Think about edges — and corners.',
        answer: '12 cubes',
        explanation:
          'A small cube with paint on exactly 2 faces sits in the middle of an edge — not at a corner. A cube has 12 edges, with one middle cube on each: 12.',
      },
    ],
  },
];

/** Total problems across all five weeks (5 weeks × 3). */
export const BUNDLE_PROBLEM_COUNT = BUNDLE_WEEKS.reduce(
  (n, w) => n + w.problems.length,
  0,
);
