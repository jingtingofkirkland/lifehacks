/**
 * Kangaroo readiness check — pure logic for the 9-question diagnostic.
 *
 * Questions come from the existing 40-question bank (questions.ts); we do
 * not invent new questions. Topic labels reuse the bank's existing
 * `category` values verbatim (Arithmetic, Geometry, Logic, ...).
 */
import { QUESTION_BANK, type KangarooQuestion } from './questions';

/** The bank's existing category labels, reused verbatim as topic names. */
export type KangarooCategory = KangarooQuestion['category'];
import {
  allPracticeProblems,
  type PracticeProblem,
} from '@/lib/practice-seo';

export const READINESS_GAME = 'kangaroo_readiness';

/**
 * The 9 diagnostic questions: 3 per point tier (3/4/5), spread across all
 * six bank categories. Ordered easy → hard like a real Kangaroo paper.
 */
export const READINESS_QUESTION_IDS = [
  'k34-001', // 3 pts · Arithmetic
  'k34-016', // 3 pts · Word Problems
  'k34-005', // 3 pts · Geometry
  'k34-024', // 4 pts · Logic
  'k34-017', // 4 pts · Time & Money
  'k34-019', // 4 pts · Patterns
  'k34-031', // 5 pts · Logic
  'k34-033', // 5 pts · Word Problems
  'k34-036', // 5 pts · Patterns
] as const;

export function readinessQuestions(): KangarooQuestion[] {
  const bank = QUESTION_BANK['grades-3-4'];
  return READINESS_QUESTION_IDS.map((id) => {
    const q = bank.find((item) => item.id === id);
    if (!q) throw new Error(`readiness: question ${id} missing from bank`);
    return q;
  });
}

export interface TopicStat {
  category: KangarooCategory;
  total: number;
  correct: number;
  /** Kangaroo-style points earned in this topic. */
  points: number;
  /** Points possible in this topic. */
  maxPoints: number;
}

/**
 * Per-topic strength summary for a finished diagnostic.
 * `answers` aligns with `readinessQuestions()` order; `null` = unanswered.
 */
export function summarizeTopics(
  questions: KangarooQuestion[],
  answers: readonly (number | null)[],
): TopicStat[] {
  const byCategory = new Map<KangarooCategory, TopicStat>();
  questions.forEach((q, i) => {
    const stat =
      byCategory.get(q.category) ??
      ({ category: q.category, total: 0, correct: 0, points: 0, maxPoints: 0 } as TopicStat);
    stat.total += 1;
    stat.maxPoints += q.points;
    if (answers[i] === q.answer) {
      stat.correct += 1;
      stat.points += q.points;
    }
    byCategory.set(q.category, stat);
  });
  // Weakest first so results and plans lead with what to practice next.
  return Array.from(byCategory.values()).sort(
    (a, b) => a.correct / a.total - b.correct / b.total || a.category.localeCompare(b.category),
  );
}

export function topicVerdict(stat: TopicStat): 'focus' | 'growing' | 'strong' {
  if (stat.correct === stat.total) return 'strong';
  if (stat.correct === 0) return 'focus';
  return 'growing';
}

export interface PracticePick {
  category: KangarooCategory;
  /** Up to 3 extra bank questions in this topic, not used by the diagnostic. */
  problems: PracticeProblem[];
}

/**
 * Recommended practice path: extra problems for the weakest topics first.
 * Only bank questions that were not part of the diagnostic are suggested,
 * linked by their existing practice-problem pages.
 */
export function recommendedPractice(
  stats: TopicStat[],
  perTopic = 3,
): PracticePick[] {
  const used = new Set<string>(READINESS_QUESTION_IDS);
  const all = allPracticeProblems();
  return stats
    .filter((s) => topicVerdict(s) !== 'strong')
    .map((s) => ({
      category: s.category,
      problems: all
        .filter((p) => p.question.category === s.category && !used.has(p.question.id))
        .slice(0, perTopic),
    }))
    .filter((pick) => pick.problems.length > 0);
}

export interface PlanWeek {
  week: number;
  title: string;
  focus: string;
  tasks: string[];
}

/**
 * The 4-week practice plan in the full (printable) report. Weeks 1–2 target
 * the two weakest topics, week 3 mixes timed practice in, week 4 re-checks.
 * Falls back gracefully when fewer topics need work.
 */
export function buildPracticePlan(stats: TopicStat[]): PlanWeek[] {
  const weak = stats.filter((s) => topicVerdict(s) !== 'strong');
  const strongest = stats[stats.length - 1];
  const topicName = (s: TopicStat | undefined, fallback: string) =>
    s ? s.category : fallback;

  const weeks: PlanWeek[] = [
    {
      week: 1,
      title: `Start with ${topicName(weak[0], 'the basics')}`,
      focus: weak[0]
        ? `${weak[0].category} was the shakiest topic in the check — short, daily wins rebuild it fastest.`
        : 'Everything looked solid — week 1 keeps the streak warm with mixed problems.',
      tasks: [
        'Do the daily challenge together each morning (about 2 minutes).',
        weak[0]
          ? `Work through 3 extra ${weak[0].category} problems from the practice list below, talking through each explanation out loud.`
          : 'Pick any 3 practice problems and race a grown-up to the answer.',
        'End the week by printing one worksheet and doing it on paper, contest-style.',
      ],
    },
    {
      week: 2,
      title: weak[1] ? `Build up ${weak[1].category}` : 'Add timed practice',
      focus: weak[1]
        ? `${weak[1].category} needs the next-most attention. Same short sessions, slightly harder problems.`
        : 'Introduce the clock: one 8-question timed quiz this week, no pressure on the score.',
      tasks: [
        weak[1]
          ? `Solve 3 extra ${weak[1].category} problems; for any miss, redo the problem the next day before looking at the answer.`
          : 'Take the 8-question timed quiz once and review every explanation together.',
        'Keep the daily challenge streak going — aim for 5 days this week.',
        'Let your child teach you one problem they got right. Teaching is the deepest practice.',
      ],
    },
    {
      week: 3,
      title: 'Mix it up under time',
      focus:
        'Real Kangaroo papers mix every topic. This week blends them so no single topic can hide.',
      tasks: [
        'Take the timed quiz twice this week; jot down which topic each miss belonged to.',
        'Print a fresh worksheet and finish it in one sitting, then check the answer key together.',
        weak[0]
          ? `Revisit ${weak[0].category} with 2 harder problems — misses from week 1 should feel easier now.`
          : 'Try two 5-point problems just for fun; partial thinking counts.',
      ],
    },
    {
      week: 4,
      title: 'Contest rehearsal + re-check',
      focus: strongest
        ? `Finish with a mini contest, then retake this readiness check to see ${strongest.category} and friends move.`
        : 'Finish with a mini contest, then retake this readiness check.',
      tasks: [
        'Run one full timed quiz as a mock contest: quiet room, clock on, no hints.',
        'Celebrate the score card — save or print it for the fridge.',
        'Retake the 9-question readiness check and compare the topic bars with today.',
      ],
    },
  ];
  return weeks;
}
