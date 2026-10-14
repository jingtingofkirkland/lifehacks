/**
 * Halloween Math Hunt question set (Grades 3–4).
 *
 * Twelve original, Halloween-themed problems written fresh for this site
 * in the Kangaroo spirit — same data shape as the Kangaroo bank
 * (`../kangaroo/questions`), five choices (A–E), 3/4/5 point tiers.
 * Six problems are playable online; the other six are print-only, so the
 * printable pack is the complete hunt. The printed pack and the online
 * hunt share this one list — same options, same answers, no drift.
 *
 * Answer key (verified by hand, 2026-10-13):
 *   hw-01 C · hw-02 A · hw-03 B · hw-04 D · hw-05 C · hw-06 D
 *   hw-07 B · hw-08 A · hw-09 C · hw-10 D · hw-11 B · hw-12 A
 */
import type { KangarooQuestion } from '../kangaroo/questions';

const B = 'grades-3-4' as const;

export const HALLOWEEN_QUESTIONS: KangarooQuestion[] = [
  {
    id: 'hw-01',
    gradeBand: B,
    points: 3,
    category: 'Arithmetic',
    question:
      'Witch Hazel fills trick-or-treat bags with 6 candies in each bag. She fills 7 bags. How many candies does she use in all?',
    options: ['36', '48', '42', '40', '13'],
    answer: 2,
    explanation: 'Each bag has 6 candies, and there are 7 bags: 6 × 7 = 42.',
  },
  {
    id: 'hw-02',
    gradeBand: B,
    points: 3,
    category: 'Arithmetic',
    question:
      'A pumpkin patch had 53 pumpkins in the morning. By noon, 18 pumpkins were sold. How many pumpkins are left?',
    options: ['35', '31', '45', '41', '71'],
    answer: 0,
    explanation: '53 − 18 = 35. (53 − 10 = 43, then 43 − 8 = 35.)',
  },
  {
    id: 'hw-03',
    gradeBand: B,
    points: 3,
    category: 'Patterns',
    question:
      'Bats fly out of a cave in a pattern: 2, 4, 8, 16, … How many bats fly out next?',
    options: ['20', '32', '24', '18', '64'],
    answer: 1,
    explanation:
      'Each number doubles: 2 × 2 = 4, 4 × 2 = 8, 8 × 2 = 16, so next is 16 × 2 = 32.',
  },
  {
    id: 'hw-04',
    gradeBand: B,
    points: 3,
    category: 'Geometry',
    question:
      'A spider web is shaped like a hexagon. A hexagon has 6 sides. How many sides do 3 hexagon webs have in total?',
    options: ['12', '24', '9', '18', '36'],
    answer: 3,
    explanation: 'Each web has 6 sides: 6 × 3 = 18.',
  },
  {
    id: 'hw-05',
    gradeBand: B,
    points: 4,
    category: 'Word Problems',
    question:
      'Leo collected 24 candies trick-or-treating. His sister collected 8 fewer candies than Leo. How many candies did they collect together?',
    options: ['32', '48', '40', '56', '16'],
    answer: 2,
    explanation: 'Sister: 24 − 8 = 16. Together: 24 + 16 = 40.',
  },
  {
    id: 'hw-06',
    gradeBand: B,
    points: 4,
    category: 'Time & Money',
    question:
      'The haunted house opens at 4:30 PM. Mia arrives 45 minutes after it opens. What time does Mia arrive?',
    options: ['5:00 PM', '6:15 PM', '5:30 PM', '5:15 PM', '5:45 PM'],
    answer: 3,
    explanation:
      '4:30 + 45 minutes: 30 minutes brings us to 5:00, and 15 more minutes makes 5:15 PM.',
  },
  {
    id: 'hw-07',
    gradeBand: B,
    points: 4,
    category: 'Word Problems',
    question:
      'A vampire buys 5 bags of candy with 9 candies in each bag. On the way home he eats 7 candies. How many candies does he have left?',
    options: ['45', '38', '32', '52', '40'],
    answer: 1,
    explanation: 'He buys 5 × 9 = 45 candies, then eats 7: 45 − 7 = 38.',
  },
  {
    id: 'hw-08',
    gradeBand: B,
    points: 4,
    category: 'Logic',
    question:
      'Three pumpkins sit in a row: an orange one, a white one, and a green one. The orange pumpkin is to the left of the white pumpkin. The green pumpkin is to the right of the white pumpkin. Which pumpkin is in the middle?',
    options: [
      'The white one',
      'The orange one',
      'The green one',
      'It cannot be told',
      'It depends on where you stand',
    ],
    answer: 0,
    explanation:
      'Orange is left of white, and green is right of white, so the order is orange – white – green. White sits in the middle.',
  },
  {
    id: 'hw-09',
    gradeBand: B,
    points: 3,
    category: 'Time & Money',
    question:
      'A toy black cat costs 7 dollars. Ben has 20 dollars. How much money will Ben have left after he buys one toy black cat?',
    options: ['27 dollars', '17 dollars', '13 dollars', '3 dollars', '7 dollars'],
    answer: 2,
    explanation: '20 − 7 = 13.',
  },
  {
    id: 'hw-10',
    gradeBand: B,
    points: 5,
    category: 'Arithmetic',
    question:
      'A witch brews 3 pots of potion. Each pot needs 4 spider webs and 5 pumpkin seeds. How many items does she need in all?',
    options: ['12', '20', '36', '27', '9'],
    answer: 3,
    explanation:
      'One pot needs 4 + 5 = 9 items. Three pots need 9 × 3 = 27 items.',
  },
  {
    id: 'hw-11',
    gradeBand: B,
    points: 5,
    category: 'Word Problems',
    question:
      'A haunted house has 4 floors. Each floor has 6 rooms. In each room there are 2 candles. How many candles are there in the whole haunted house?',
    options: ['24', '48', '12', '36', '96'],
    answer: 1,
    explanation: 'Rooms: 4 × 6 = 24. Candles: 24 × 2 = 48.',
  },
  {
    id: 'hw-12',
    gradeBand: B,
    points: 5,
    category: 'Patterns',
    question:
      'Nina carves pumpkins on 3 days. On day 1 she carves 4 pumpkins. Each day she carves 2 more pumpkins than the day before. How many pumpkins does she carve in all 3 days?',
    options: ['18', '12', '20', '16', '24'],
    answer: 0,
    explanation:
      'Day 1: 4, day 2: 4 + 2 = 6, day 3: 6 + 2 = 8. Total: 4 + 6 + 8 = 18.',
  },
];

/** Decorative emoji per problem, keyed by question id. */
export const HALLOWEEN_EMOJI: Record<string, string> = {
  'hw-01': '🎃',
  'hw-02': '🎃',
  'hw-03': '🦇',
  'hw-04': '🕸️',
  'hw-05': '🍬',
  'hw-06': '👻',
  'hw-07': '🧛',
  'hw-08': '🎃',
  'hw-09': '🐈‍⬛',
  'hw-10': '🧙',
  'hw-11': '🏚️',
  'hw-12': '🎃',
};

/** Ids of the six problems playable online; the rest are print-only. */
export const ONLINE_IDS = ['hw-01', 'hw-03', 'hw-05', 'hw-08', 'hw-10', 'hw-12'];

export function getOnlineQuestions(): KangarooQuestion[] {
  return HALLOWEEN_QUESTIONS.filter((q) => ONLINE_IDS.includes(q.id));
}

export function getPrintOnlyQuestions(): KangarooQuestion[] {
  return HALLOWEEN_QUESTIONS.filter((q) => !ONLINE_IDS.includes(q.id));
}

/** Score a finished online hunt: points earned vs points possible. */
export function scoreHunt(
  questions: KangarooQuestion[],
  picks: Record<string, number | null | undefined>,
): { earned: number; possible: number; correctCount: number } {
  let earned = 0;
  let possible = 0;
  let correctCount = 0;
  for (const q of questions) {
    possible += q.points;
    if (picks[q.id] === q.answer) {
      earned += q.points;
      correctCount += 1;
    }
  }
  return { earned, possible, correctCount };
}
