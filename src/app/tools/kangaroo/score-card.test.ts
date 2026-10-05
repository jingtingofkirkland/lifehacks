/**
 * Unit tests for the score share-card text model (pure helpers only —
 * the canvas drawing itself is covered by the kangaroo e2e test).
 */
import { describe, expect, it } from 'vitest';
import { buildScoreCardModel, formatDuration } from './score-card';

describe('formatDuration', () => {
  it('formats m:ss', () => {
    expect(formatDuration(0)).toBe('0:00');
    expect(formatDuration(65)).toBe('1:05');
    expect(formatDuration(277)).toBe('4:37');
    expect(formatDuration(720)).toBe('12:00');
  });

  it('clamps negative and fractional input', () => {
    expect(formatDuration(-30)).toBe('0:00');
    expect(formatDuration(61.9)).toBe('1:01');
  });
});

describe('buildScoreCardModel', () => {
  it('builds the share-card text from a quiz result', () => {
    const model = buildScoreCardModel({
      earned: 21,
      possible: 32,
      correctCount: 7,
      totalQuestions: 8,
      secondsUsed: 277,
    });
    expect(model.scoreText).toBe('7/8');
    expect(model.scoreLabel).toBe('questions correct');
    expect(model.pointsText).toBe('21 of 32 points');
    expect(model.timeText).toContain('4:37');
    expect(model.watermark).toBe('lifehacks.zeey-app.net');
  });

  it('handles a perfect score at the full time limit', () => {
    const model = buildScoreCardModel({
      earned: 32,
      possible: 32,
      correctCount: 8,
      totalQuestions: 8,
      secondsUsed: 720,
    });
    expect(model.scoreText).toBe('8/8');
    expect(model.timeText).toContain('12:00');
  });
});
