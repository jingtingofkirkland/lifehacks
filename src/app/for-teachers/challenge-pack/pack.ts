/**
 * The 5-Day Math Challenge Pack: five problems drawn from the site's
 * existing Kangaroo-style question bank (src/app/tools/kangaroo/questions.ts),
 * sequenced easy → hard for a Monday–Friday classroom challenge.
 *
 * Problems are referenced by bank ID (never copied) so the pack always
 * matches the online practice set — including answers and explanations.
 * pack.test.ts guards the selection: if a bank edit ever removes or
 * re-tiers one of these IDs, CI fails instead of the pack silently breaking.
 */
import {
  QUESTION_BANK,
  type KangarooQuestion,
} from '@/app/tools/kangaroo/questions';

/** Bank IDs in Day 1 → Day 5 order (3, 3, 4, 4, 5 points). */
export const PACK_QUESTION_IDS = [
  'k34-002', // Day 1 · 3 pts · Word Problems — kangaroo hops (playful opener)
  'k34-011', // Day 2 · 3 pts · Patterns — 2, 4, 6, 8, …
  'k34-021', // Day 3 · 4 pts · Geometry — square perimeter
  'k34-029', // Day 4 · 4 pts · Logic — mystery two-digit number
  'k34-033', // Day 5 · 5 pts · Word Problems — balance-scale finale
] as const;

/** The five pack problems, in day order. Missing IDs are skipped here and
 *  caught by pack.test.ts. */
export function getPackQuestions(): KangarooQuestion[] {
  const bank = QUESTION_BANK['grades-3-4'];
  return PACK_QUESTION_IDS.map((id) => bank.find((q) => q.id === id)).filter(
    (q): q is KangarooQuestion => q !== undefined,
  );
}
