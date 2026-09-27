/**
 * Math Kangaroo prep question bank (Grades 3–4 / Ecolier level).
 *
 * IMPORTANT — originality: every problem below was written fresh for this
 * site in a Kangaroo-like spirit (playful story contexts, 5 choices, 3/4/5
 * point tiers). None of them are past Math Kangaroo contest questions, and
 * the page carries a disclaimer to that effect. Do not paste real contest
 * problems into this file.
 *
 * Architecture note: banks are keyed by grade band so a future 'grades-5-6'
 * bank slots in without touching the selection logic.
 */

export type GradeBand = 'grades-3-4';

export interface KangarooQuestion {
  id: string;
  gradeBand: GradeBand;
  /** Kangaroo-style difficulty tier: 3 = easy, 4 = medium, 5 = hard. */
  points: 3 | 4 | 5;
  category:
    | 'Arithmetic'
    | 'Patterns'
    | 'Geometry'
    | 'Logic'
    | 'Time & Money'
    | 'Word Problems';
  question: string;
  /** Five answer choices, shown as A–E. */
  options: [string, string, string, string, string];
  /** Index (0–4) of the correct choice. */
  answer: 0 | 1 | 2 | 3 | 4;
  explanation: string;
}

const B: GradeBand = 'grades-3-4';

export const QUESTION_BANK: Record<GradeBand, KangarooQuestion[]> = {
  'grades-3-4': [
    {
      id: 'k34-001',
      gradeBand: B,
      points: 3,
      category: 'Arithmetic',
      question:
        'Maya has 7 stickers. Her brother gives her 5 more stickers. How many stickers does Maya have now?',
      options: ['10', '11', '12', '13', '14'],
      answer: 2,
      explanation: '7 + 5 = 12. Just add the new stickers to the ones she had.',
    },
    {
      id: 'k34-002',
      gradeBand: B,
      points: 3,
      category: 'Word Problems',
      question:
        'A kangaroo hops 3 meters with every hop. How far has it gone after 4 hops?',
      options: ['7 meters', '9 meters', '10 meters', '12 meters', '15 meters'],
      answer: 3,
      explanation: 'Each hop is 3 meters, so 4 hops make 3 + 3 + 3 + 3 = 12 meters.',
    },
    {
      id: 'k34-003',
      gradeBand: B,
      points: 3,
      category: 'Arithmetic',
      question: 'Which of these numbers is even?',
      options: ['3', '7', '11', '14', '21'],
      answer: 3,
      explanation: 'Even numbers end in 0, 2, 4, 6 or 8. Only 14 qualifies.',
    },
    {
      id: 'k34-004',
      gradeBand: B,
      points: 3,
      category: 'Arithmetic',
      question:
        'Tom has 20 marbles. He gives 6 marbles to Ann. How many marbles does Tom have left?',
      options: ['12', '13', '14', '15', '16'],
      answer: 2,
      explanation: '20 − 6 = 14 marbles left.',
    },
    {
      id: 'k34-005',
      gradeBand: B,
      points: 3,
      category: 'Geometry',
      question: 'How many sides does a hexagon have?',
      options: ['4', '5', '6', '7', '8'],
      answer: 2,
      explanation: 'Hexa- means six: a hexagon has 6 sides.',
    },
    {
      id: 'k34-006',
      gradeBand: B,
      points: 3,
      category: 'Arithmetic',
      question: 'What is 5 + 5 + 5?',
      options: ['10', '12', '15', '20', '25'],
      answer: 2,
      explanation: 'Three fives make 15. That is the same as 3 × 5.',
    },
    {
      id: 'k34-007',
      gradeBand: B,
      points: 3,
      category: 'Time & Money',
      question: 'One week has 7 days. How many days are there in 3 weeks?',
      options: ['10', '14', '17', '21', '24'],
      answer: 3,
      explanation: '3 weeks × 7 days = 21 days.',
    },
    {
      id: 'k34-008',
      gradeBand: B,
      points: 3,
      category: 'Arithmetic',
      question: 'Which of these numbers is the largest?',
      options: ['29', '92', '19', '91', '89'],
      answer: 1,
      explanation:
        'Compare the tens digits first: 92 has the biggest tens digit (9) and the biggest ones digit among the 90s.',
    },
    {
      id: 'k34-009',
      gradeBand: B,
      points: 3,
      category: 'Word Problems',
      question:
        'Lily reads 4 pages of her book every day. How many pages does she read in 5 days?',
      options: ['9', '15', '18', '20', '25'],
      answer: 3,
      explanation: '5 days × 4 pages = 20 pages.',
    },
    {
      id: 'k34-010',
      gradeBand: B,
      points: 3,
      category: 'Arithmetic',
      question: 'What is half of 18?',
      options: ['6', '8', '9', '10', '12'],
      answer: 2,
      explanation: 'Half of 18 is 18 ÷ 2 = 9.',
    },
    {
      id: 'k34-011',
      gradeBand: B,
      points: 3,
      category: 'Patterns',
      question: 'What number comes next? 2, 4, 6, 8, …',
      options: ['9', '10', '11', '12', '16'],
      answer: 1,
      explanation: 'The pattern counts up by 2 each time, so 8 + 2 = 10.',
    },
    {
      id: 'k34-012',
      gradeBand: B,
      points: 3,
      category: 'Word Problems',
      question:
        'A pizza is cut into 8 equal slices. Sam eats 3 slices. How many slices are left?',
      options: ['3', '4', '5', '6', '11'],
      answer: 2,
      explanation: '8 − 3 = 5 slices left.',
    },
    {
      id: 'k34-013',
      gradeBand: B,
      points: 3,
      category: 'Arithmetic',
      question: 'What is 36 − 9?',
      options: ['25', '26', '27', '28', '29'],
      answer: 2,
      explanation: '36 − 10 = 26, so 36 − 9 is one more: 27.',
    },
    {
      id: 'k34-014',
      gradeBand: B,
      points: 3,
      category: 'Geometry',
      question:
        'One triangle has 3 sides. How many sides do 4 separate triangles have altogether?',
      options: ['7', '9', '12', '14', '16'],
      answer: 2,
      explanation: '4 triangles × 3 sides = 12 sides.',
    },
    {
      id: 'k34-015',
      gradeBand: B,
      points: 3,
      category: 'Geometry',
      question: 'Which shape has no corners at all?',
      options: ['triangle', 'square', 'circle', 'rectangle', 'pentagon'],
      answer: 2,
      explanation:
        'A circle is perfectly round — it has no corners. Every other shape listed does.',
    },
    {
      id: 'k34-016',
      gradeBand: B,
      points: 3,
      category: 'Word Problems',
      question:
        'Ben is 9 years old. His sister is 4 years younger than Ben. How old is his sister?',
      options: ['4', '5', '6', '9', '13'],
      answer: 1,
      explanation: '9 − 4 = 5 years old.',
    },
    {
      id: 'k34-017',
      gradeBand: B,
      points: 4,
      category: 'Time & Money',
      question:
        'A movie starts at 2:00 PM and lasts 45 minutes. At what time does it end?',
      options: ['2:15 PM', '2:30 PM', '2:45 PM', '3:00 PM', '3:45 PM'],
      answer: 2,
      explanation: '2:00 + 45 minutes = 2:45 PM.',
    },
    {
      id: 'k34-018',
      gradeBand: B,
      points: 4,
      category: 'Time & Money',
      question:
        'A notebook costs $2. You pay with a $5 bill. How much change do you get back?',
      options: ['$1', '$2', '$3', '$4', '$7'],
      answer: 2,
      explanation: '$5 − $2 = $3 change.',
    },
    {
      id: 'k34-019',
      gradeBand: B,
      points: 4,
      category: 'Patterns',
      question: 'What number comes next? 5, 10, 20, 40, …',
      options: ['50', '60', '70', '80', '100'],
      answer: 3,
      explanation: 'Each number is double the one before it, so 40 × 2 = 80.',
    },
    {
      id: 'k34-020',
      gradeBand: B,
      points: 4,
      category: 'Word Problems',
      question:
        '24 kids are having lunch. Each table seats 6 kids. How many tables do they need?',
      options: ['3', '4', '5', '6', '18'],
      answer: 1,
      explanation: '24 ÷ 6 = 4 tables.',
    },
    {
      id: 'k34-021',
      gradeBand: B,
      points: 4,
      category: 'Geometry',
      question:
        'A square has a perimeter of 20 cm. How long is one side of the square?',
      options: ['4 cm', '5 cm', '6 cm', '10 cm', '20 cm'],
      answer: 1,
      explanation:
        'A square has 4 equal sides, so one side is 20 ÷ 4 = 5 cm.',
    },
    {
      id: 'k34-022',
      gradeBand: B,
      points: 4,
      category: 'Patterns',
      question:
        'A frog jumps 5 cm at a time: 5, 10, 15, … Which of these numbers will the frog land on?',
      options: ['17', '20', '23', '27', '31'],
      answer: 1,
      explanation:
        'The frog only lands on multiples of 5. Of the choices, only 20 is a multiple of 5.',
    },
    {
      id: 'k34-023',
      gradeBand: B,
      points: 4,
      category: 'Word Problems',
      question:
        'Mia has twice as many apples as Sam. Sam has 6 apples. How many apples does Mia have?',
      options: ['3', '6', '8', '12', '18'],
      answer: 3,
      explanation: 'Twice as many means 2 × 6 = 12 apples.',
    },
    {
      id: 'k34-024',
      gradeBand: B,
      points: 4,
      category: 'Logic',
      question:
        'Four of these numbers are multiples of 3. Which one is NOT a multiple of 3?',
      options: ['6', '9', '14', '12', '21'],
      answer: 2,
      explanation:
        '6, 9, 12 and 21 are all in the 3-times table. 14 ÷ 3 = 4 remainder 2, so 14 is the odd one out.',
    },
    {
      id: 'k34-025',
      gradeBand: B,
      points: 4,
      category: 'Geometry',
      question: 'A rectangle is 4 cm wide and 7 cm long. What is its area?',
      options: ['11 cm²', '22 cm²', '24 cm²', '28 cm²', '32 cm²'],
      answer: 3,
      explanation: 'Area = width × length = 4 × 7 = 28 cm².',
    },
    {
      id: 'k34-026',
      gradeBand: B,
      points: 4,
      category: 'Arithmetic',
      question: 'What is 100 − 37?',
      options: ['57', '60', '63', '67', '73'],
      answer: 2,
      explanation: '100 − 40 = 60, so 100 − 37 is 3 more: 63.',
    },
    {
      id: 'k34-027',
      gradeBand: B,
      points: 4,
      category: 'Word Problems',
      question:
        'Three friends share 18 cookies equally. How many cookies does each friend get?',
      options: ['3', '5', '6', '9', '15'],
      answer: 2,
      explanation: '18 ÷ 3 = 6 cookies each.',
    },
    {
      id: 'k34-028',
      gradeBand: B,
      points: 4,
      category: 'Time & Money',
      question: 'The clock shows half past 3. What time is it?',
      options: ['2:30', '3:00', '3:15', '3:30', '4:30'],
      answer: 3,
      explanation: 'Half past 3 means 30 minutes after 3, which is 3:30.',
    },
    {
      id: 'k34-029',
      gradeBand: B,
      points: 4,
      category: 'Logic',
      question:
        'I am thinking of a 2-digit number. My digits add up to 10. I am even. I am between 50 and 70. What number am I?',
      options: ['52', '55', '64', '73', '46'],
      answer: 2,
      explanation:
        'Check each clue: 64 has digits that sum to 10 (6 + 4), it is even, and it sits between 50 and 70. None of the other choices fit all three clues.',
    },
    {
      id: 'k34-030',
      gradeBand: B,
      points: 4,
      category: 'Arithmetic',
      question: 'What is 7 × 8?',
      options: ['48', '54', '56', '63', '72'],
      answer: 2,
      explanation: '7 × 8 = 56.',
    },
    {
      id: 'k34-031',
      gradeBand: B,
      points: 5,
      category: 'Logic',
      question:
        'Four kids stand in a line. Dan is first. Ben is not first. Ann stands right behind Ben. Who is standing last?',
      options: ['Ann', 'Ben', 'Dan', 'Kim', 'Cannot tell'],
      answer: 3,
      explanation:
        'Dan is first, so Ben must be second or later. Ann is right behind Ben. The only order that fits is Dan, Ben, Ann — leaving Kim last.',
    },
    {
      id: 'k34-032',
      gradeBand: B,
      points: 5,
      category: 'Logic',
      question:
        'An ice-cream shop has 3 flavors: vanilla, chocolate, strawberry. How many different 2-scoop cones can you make if both scoops are allowed to be the same flavor?',
      options: ['3', '5', '6', '9', '12'],
      answer: 2,
      explanation:
        'List them: vanilla-vanilla, chocolate-chocolate, strawberry-strawberry, vanilla-chocolate, vanilla-strawberry, chocolate-strawberry. That is 6.',
    },
    {
      id: 'k34-033',
      gradeBand: B,
      points: 5,
      category: 'Word Problems',
      question:
        'On a balance scale, 2 apples balance 6 plums. How many plums would balance 5 apples?',
      options: ['10', '12', '15', '18', '30'],
      answer: 2,
      explanation:
        'If 2 apples = 6 plums, then 1 apple = 3 plums. So 5 apples = 5 × 3 = 15 plums.',
    },
    {
      id: 'k34-034',
      gradeBand: B,
      points: 5,
      category: 'Time & Money',
      question:
        'May 1st is a Monday. What day of the week is May 20th?',
      options: ['Monday', 'Wednesday', 'Friday', 'Saturday', 'Sunday'],
      answer: 3,
      explanation:
        'Mondays in May are the 1st, 8th and 15th. Counting forward: 16th Tuesday, 17th Wednesday, 18th Thursday, 19th Friday, 20th Saturday.',
    },
    {
      id: 'k34-035',
      gradeBand: B,
      points: 5,
      category: 'Word Problems',
      question:
        'A snail climbs 3 meters up a 10-meter wall each day, then slips back 2 meters each night. On which day does the snail reach the top of the wall?',
      options: ['day 7', 'day 8', 'day 9', 'day 10', 'day 11'],
      answer: 1,
      explanation:
        'The snail gains 1 meter per full day. After 7 days it is at 7 meters; on day 8 it climbs 3 meters to reach 10 — the top — before any slipping.',
    },
    {
      id: 'k34-036',
      gradeBand: B,
      points: 5,
      category: 'Patterns',
      question:
        'Figure 1 is made of 4 matchsticks, figure 2 of 7 matchsticks, figure 3 of 10 matchsticks. How many matchsticks does figure 6 need?',
      options: ['16', '18', '19', '21', '22'],
      answer: 2,
      explanation:
        'Each new figure adds 3 matchsticks: 4, 7, 10, 13, 16, 19. Figure 6 needs 19.',
    },
    {
      id: 'k34-037',
      gradeBand: B,
      points: 5,
      category: 'Word Problems',
      question:
        'Ella has 3 boxes. Each box holds 4 bags. Each bag holds 2 candies. How many candies are there altogether?',
      options: ['9', '12', '18', '24', '32'],
      answer: 3,
      explanation: '3 × 4 × 2 = 24 candies.',
    },
    {
      id: 'k34-038',
      gradeBand: B,
      points: 5,
      category: 'Arithmetic',
      question:
        'Leo thinks of a number. He doubles it and adds 6, and the result is 20. What was his number?',
      options: ['5', '6', '7', '8', '14'],
      answer: 2,
      explanation:
        'Work backwards: 20 − 6 = 14, and half of 14 is 7. Check: 7 × 2 + 6 = 20. ✓',
    },
    {
      id: 'k34-039',
      gradeBand: B,
      points: 5,
      category: 'Logic',
      question:
        'The sum of three consecutive whole numbers is 24. What is the middle number?',
      options: ['6', '7', '8', '9', '12'],
      answer: 2,
      explanation:
        'Three consecutive numbers are always n−1, n, n+1, and they add up to 3n. So 3n = 24 and n = 8. (Check: 7 + 8 + 9 = 24. ✓)',
    },
    {
      id: 'k34-040',
      gradeBand: B,
      points: 5,
      category: 'Word Problems',
      question:
        'A book has 60 pages. Zoe reads 9 pages a day. How many days does she need to finish the whole book?',
      options: ['5', '6', '7', '8', '9'],
      answer: 2,
      explanation:
        '60 ÷ 9 = 6 remainder 6, so 6 days are not quite enough — she needs a 7th day for the last pages.',
    },
  ],
};

/* ── Deterministic selection helpers ─────────────────────────────── */

/** Whole days since the Unix epoch, in UTC — stable for everyone, everywhere. */
export function dayNumber(date: Date = new Date()): number {
  const utcMidnight = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
  );
  return Math.floor(utcMidnight / 86_400_000);
}

/**
 * The daily challenge: rotates through the bank in order, so no problem
 * repeats until the whole bank has been shown.
 */
export function getDailyQuestion(
  band: GradeBand = 'grades-3-4',
  date: Date = new Date(),
): KangarooQuestion {
  const bank = QUESTION_BANK[band];
  return bank[dayNumber(date) % bank.length];
}

/** Tiny seeded PRNG (mulberry32) so a day's quiz is the same for everyone. */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Pick `count` distinct questions for the timed quiz, seeded by the day so
 * every visitor gets the same "today's quiz" (nice for classrooms and
 * siblings). Pass an explicit seed for a fresh random quiz.
 */
export function getQuizQuestions(
  band: GradeBand = 'grades-3-4',
  count = 8,
  seed?: number,
  date: Date = new Date(),
): KangarooQuestion[] {
  const bank = [...QUESTION_BANK[band]];
  const rand = seededRandom(seed ?? dayNumber(date));
  for (let i = bank.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [bank[i], bank[j]] = [bank[j], bank[i]];
  }
  return bank.slice(0, Math.min(count, bank.length));
}

/** Total Kangaroo points for the correctly answered questions. */
export function scoreQuiz(
  questions: KangarooQuestion[],
  answers: (number | null)[],
): { earned: number; possible: number; correctCount: number } {
  let earned = 0;
  let correctCount = 0;
  const possible = questions.reduce((s, q) => s + q.points, 0);
  questions.forEach((q, i) => {
    if (answers[i] === q.answer) {
      earned += q.points;
      correctCount += 1;
    }
  });
  return { earned, possible, correctCount };
}
