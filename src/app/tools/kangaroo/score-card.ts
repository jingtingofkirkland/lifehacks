/**
 * Pure text model for the quiz-completion "score share card".
 *
 * Kept separate from the canvas component so the wording/styling decisions
 * are unit-testable without a DOM. The visual card is drawn by ScoreCard.tsx
 * from exactly these strings.
 */

export interface ScoreCardData {
  /** Points earned (Kangaroo scoring: 3/4/5 per question). */
  earned: number;
  /** Points possible across all questions. */
  possible: number;
  /** Questions answered correctly. */
  correctCount: number;
  /** Questions in the quiz. */
  totalQuestions: number;
  /** Wall-clock seconds the quiz took. */
  secondsUsed: number;
}

export interface ScoreCardModel {
  title: string;
  scoreText: string;
  scoreLabel: string;
  pointsText: string;
  timeText: string;
  watermark: string;
}

/** Format a duration as m:ss (clamped at 0). */
export function formatDuration(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function buildScoreCardModel(data: ScoreCardData): ScoreCardModel {
  return {
    title: 'Math Kangaroo Prep',
    scoreText: `${data.correctCount}/${data.totalQuestions}`,
    scoreLabel: 'questions correct',
    pointsText: `${data.earned} of ${data.possible} points`,
    timeText: `⏱ Finished in ${formatDuration(data.secondsUsed)}`,
    watermark: 'lifehacks.zeey-app.net',
  };
}
