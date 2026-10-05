'use client';

import { useEffect, useMemo, useRef } from 'react';
import { trackEvent } from '@/lib/pixel';
import { buildScoreCardModel, type ScoreCardData } from './score-card';

/**
 * Quiz-completion score share card: draws a 1200x630 (social-share sized)
 * PNG on a canvas right on the completion screen — score, time used, the
 * 🦘 brand mark and the site watermark — with a one-tap download button so
 * parents/kids can save or share it. Everything runs client-side; nothing
 * is uploaded anywhere.
 */

const CARD_WIDTH = 1200;
const CARD_HEIGHT = 630;
const EMOJI_FONT =
  '"Apple Color Emoji", "Segoe UI Emoji", "NotoColor Emoji", sans-serif';
const TEXT_FONT = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

function drawScoreCard(canvas: HTMLCanvasElement, data: ScoreCardData): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const model = buildScoreCardModel(data);
  const { width, height } = canvas;
  const cx = width / 2;

  // Background: violet -> fuchsia gradient, matching the Kangaroo hub.
  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, '#7c3aed');
  bg.addColorStop(1, '#c026d3');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // Soft decorative circles.
  ctx.fillStyle = 'rgba(255, 255, 255, 0.10)';
  for (const [x, y, r] of [
    [120, 90, 90],
    [1080, 140, 120],
    [1010, 540, 70],
    [150, 520, 55],
  ] as const) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Kangaroo brand mark.
  ctx.font = `130px ${EMOJI_FONT}`;
  ctx.fillText('🦘', cx, 128);

  // Title.
  ctx.fillStyle = '#ffffff';
  ctx.font = `700 46px ${TEXT_FONT}`;
  ctx.fillText(model.title, cx, 238);

  // Big score, e.g. 7/8.
  ctx.font = `900 170px ${TEXT_FONT}`;
  ctx.fillText(model.scoreText, cx, 372);

  // Score detail: questions correct · points.
  ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
  ctx.font = `600 36px ${TEXT_FONT}`;
  ctx.fillText(
    `${model.scoreLabel} · ${model.pointsText}`,
    cx,
    478,
  );

  // Time used.
  ctx.font = `500 34px ${TEXT_FONT}`;
  ctx.fillText(model.timeText, cx, 530);

  // Site watermark.
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.font = `600 28px ${TEXT_FONT}`;
  ctx.fillText(model.watermark, cx, height - 34);
}

export function ScoreCard(props: ScoreCardData) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const data = useMemo<ScoreCardData>(
    () => ({
      earned: props.earned,
      possible: props.possible,
      correctCount: props.correctCount,
      totalQuestions: props.totalQuestions,
      secondsUsed: props.secondsUsed,
    }),
    [
      props.earned,
      props.possible,
      props.correctCount,
      props.totalQuestions,
      props.secondsUsed,
    ],
  );

  useEffect(() => {
    if (canvasRef.current) drawScoreCard(canvasRef.current, data);
  }, [data]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    trackEvent('ScoreCardDownloaded', {
      game: 'kangaroo_quiz',
      score: data.earned,
      total: data.possible,
    });
    const filename = 'math-kangaroo-score-card.png';
    const save = (href: string) => {
      const a = document.createElement('a');
      a.href = href;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
    };
    if (typeof canvas.toBlob === 'function') {
      canvas.toBlob((blob) => {
        if (!blob) {
          save(canvas.toDataURL('image/png'));
          return;
        }
        const url = URL.createObjectURL(blob);
        save(url);
        window.setTimeout(() => URL.revokeObjectURL(url), 4000);
      }, 'image/png');
    } else {
      save(canvas.toDataURL('image/png'));
    }
  };

  return (
    <div
      className="rounded-2xl border border-violet-200/80 dark:border-violet-800/40 bg-white/80 dark:bg-card/80 p-6 text-center mb-6"
      data-testid="kq-score-card"
    >
      <h3 className="font-bold text-lg mb-1">🏆 Share your score</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Save your score card and show it off — great job today!
      </p>
      <canvas
        ref={canvasRef}
        width={CARD_WIDTH}
        height={CARD_HEIGHT}
        className="w-full h-auto rounded-xl shadow-md"
        role="img"
        aria-label={`Score card: ${buildScoreCardModel(data).scoreText} ${buildScoreCardModel(data).scoreLabel}, ${buildScoreCardModel(data).pointsText}`}
        data-testid="kq-score-card-canvas"
      />
      <div className="mt-4">
        <button
          type="button"
          onClick={download}
          data-testid="kq-score-card-download"
          className="px-6 py-2.5 rounded-full bg-violet-600 hover:bg-violet-700 text-white font-semibold shadow transition-all hover:-translate-y-0.5"
        >
          📸 Download score card
        </button>
      </div>
    </div>
  );
}
