'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { UsefulnessFeedback } from '@/components/UsefulnessFeedback';
import { trackEvent } from '@/lib/pixel';
import {
  CUSTOM_WORDS_KEY,
  REMOVED_WORDS_KEY,
  TALLY_KEY,
  WORD_BANK,
  makeCustomWord,
  maskWord,
  mergePool,
  parseCustomWords,
  parseRemovedIds,
  parseTally,
  pickWord,
  themeById,
  themeWords,
  wordText,
  type CustomWord,
  type Lang,
  type ThemeChoice,
  type ThemeId,
  type WordEntry,
} from './words';

const GAME = 'draw_guess';

type Phase = 'ready' | 'peek' | 'draw' | 'reveal';

const COLORS: { hex: string; name: string }[] = [
  { hex: '#111827', name: 'Black 黑' },
  { hex: '#dc2626', name: 'Red 红' },
  { hex: '#f97316', name: 'Orange 橙' },
  { hex: '#eab308', name: 'Yellow 黄' },
  { hex: '#22c55e', name: 'Green 绿' },
  { hex: '#2563eb', name: 'Blue 蓝' },
  { hex: '#8b5cf6', name: 'Purple 紫' },
  { hex: '#92400e', name: 'Brown 棕' },
];

const BRUSHES: { id: string; label: string; frac: number; dot: number }[] = [
  { id: 'thin', label: '细 Thin', frac: 0.007, dot: 8 },
  { id: 'mid', label: '中 Med', frac: 0.016, dot: 16 },
  { id: 'thick', label: '粗 Thick', frac: 0.03, dot: 26 },
];

const DURATIONS = [60, 90, 120];

interface Stroke {
  color: string | null; // null = eraser
  frac: number;
  points: { x: number; y: number }[];
}

function beep() {
  try {
    const Ctx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    [0, 0.22].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.18, ctx.currentTime + offset);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + offset + 0.18,
      );
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + offset);
      osc.stop(ctx.currentTime + offset + 0.2);
    });
    window.setTimeout(() => void ctx.close(), 700);
  } catch {
    // Sound is a nicety; never break the game over it.
  }
}

/* ═══════════════════════ Drawing canvas ═══════════════════════ */

function DrawCanvas({
  color,
  brushFrac,
  erasing,
  resetSignal,
  onStrokeEnd,
}: {
  color: string;
  brushFrac: number;
  erasing: boolean;
  resetSignal: number;
  onStrokeEnd: (count: number) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const currentRef = useRef<Stroke | null>(null);
  const drawingRef = useRef(false);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    for (const stroke of strokesRef.current) {
      drawStroke(ctx, stroke, w, h);
    }
  }, []);

  const drawStroke = (
    ctx: CanvasRenderingContext2D,
    stroke: Stroke,
    w: number,
    h: number,
  ) => {
    if (stroke.points.length === 0) return;
    ctx.save();
    ctx.globalCompositeOperation = stroke.color
      ? 'source-over'
      : 'destination-out';
    ctx.strokeStyle = stroke.color ?? '#000';
    ctx.fillStyle = stroke.color ?? '#000';
    ctx.lineWidth = Math.max(1.5, stroke.frac * w);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const pts = stroke.points.map((p) => ({ x: p.x * w, y: p.y * h }));
    if (pts.length === 1) {
      ctx.beginPath();
      ctx.arc(pts[0].x, pts[0].y, ctx.lineWidth / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i += 1) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.stroke();
    }
    ctx.restore();
  };

  // Size the bitmap to the box (DPR aware) and replay strokes on resize.
  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const fit = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (w === 0 || h === 0) return;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      redraw();
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [redraw]);

  // Clear when a new round starts.
  useEffect(() => {
    strokesRef.current = [];
    currentRef.current = null;
    redraw();
    onStrokeEnd(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetSignal]);

  const pos = (e: React.PointerEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) return { x: 0, y: 0 };
    return {
      x: Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)),
      y: Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height)),
    };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    drawingRef.current = true;
    const stroke: Stroke = {
      color: erasing ? null : color,
      frac: brushFrac,
      points: [pos(e)],
    };
    currentRef.current = stroke;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) drawStroke(ctx, stroke, canvas.clientWidth, canvas.clientHeight);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drawingRef.current || !currentRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const p = pos(e);
    const stroke = currentRef.current;
    const prev = stroke.points[stroke.points.length - 1];
    stroke.points.push(p);
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawStroke(
      ctx,
      { ...stroke, points: [prev, p] },
      canvas.clientWidth,
      canvas.clientHeight,
    );
  };

  const endStroke = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    if (currentRef.current && currentRef.current.points.length > 0) {
      strokesRef.current = [...strokesRef.current.slice(-59), currentRef.current];
      onStrokeEnd(strokesRef.current.length);
    }
    currentRef.current = null;
  };

  return (
    <div
      ref={wrapRef}
      className="relative w-full overflow-hidden rounded-2xl border-2 border-blue-200 bg-white dark:border-blue-900"
      style={{ height: 'min(56vh, 540px)' }}
    >
      <canvas
        ref={canvasRef}
        data-testid="draw-canvas"
        className="block h-full w-full touch-none select-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endStroke}
        onPointerCancel={endStroke}
      />
      {/* Undo/clear need canvas internals, so they are exposed via events. */}
      <CanvasBridge
        strokesRef={strokesRef}
        redraw={redraw}
        onStrokeEnd={onStrokeEnd}
      />
    </div>
  );
}

/** Tiny bridge so toolbar buttons can undo/clear the canvas strokes. */
function CanvasBridge({
  strokesRef,
  redraw,
  onStrokeEnd,
}: {
  strokesRef: React.MutableRefObject<Stroke[]>;
  redraw: () => void;
  onStrokeEnd: (count: number) => void;
}) {
  useEffect(() => {
    const handler = (e: Event) => {
      const action = (e as CustomEvent<string>).detail;
      if (action === 'undo') {
        strokesRef.current = strokesRef.current.slice(0, -1);
        redraw();
        onStrokeEnd(strokesRef.current.length);
      } else if (action === 'clear') {
        strokesRef.current = [];
        redraw();
        onStrokeEnd(0);
      }
    };
    window.addEventListener('draw-guess-canvas', handler);
    return () => window.removeEventListener('draw-guess-canvas', handler);
  }, [strokesRef, redraw, onStrokeEnd]);
  return null;
}

const canvasAction = (action: 'undo' | 'clear') =>
  window.dispatchEvent(new CustomEvent('draw-guess-canvas', { detail: action }));

/* ═══════════════════════ Main game ═══════════════════════ */

export default function DrawGuess() {
  const [phase, setPhase] = useState<Phase>('ready');
  const [themeChoice, setThemeChoice] = useState<ThemeChoice>('all');
  const [lang, setLang] = useState<Lang>('zh');
  const [duration, setDuration] = useState(90);
  const [current, setCurrent] = useState<WordEntry | null>(null);
  const [peeking, setPeeking] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(90);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [round, setRound] = useState(0);
  const [tally, setTally] = useState(0);
  const [color, setColor] = useState(COLORS[0].hex);
  const [brush, setBrush] = useState(BRUSHES[1]);
  const [erasing, setErasing] = useState(false);
  const [strokeCount, setStrokeCount] = useState(0);

  const [customWords, setCustomWords] = useState<CustomWord[]>([]);
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [managerTheme, setManagerTheme] = useState<ThemeId>('animals');
  const [newWordText, setNewWordText] = useState('');

  const lastIdRef = useRef<string | null>(null);
  const startedRef = useRef(false);
  const endAtRef = useRef<number | null>(null);

  /* ── localStorage: load once, then persist on change ── */
  useEffect(() => {
    try {
      setCustomWords(parseCustomWords(window.localStorage.getItem(CUSTOM_WORDS_KEY)));
      setRemovedIds(parseRemovedIds(window.localStorage.getItem(REMOVED_WORDS_KEY)));
      setTally(parseTally(window.localStorage.getItem(TALLY_KEY)));
    } catch {
      // Storage unavailable (private mode) — the game still works in-memory.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(CUSTOM_WORDS_KEY, JSON.stringify(customWords));
      window.localStorage.setItem(REMOVED_WORDS_KEY, JSON.stringify(removedIds));
      window.localStorage.setItem(TALLY_KEY, String(tally));
    } catch {
      // ignore
    }
  }, [hydrated, customWords, removedIds, tally]);

  const pool = useMemo(
    () => mergePool(themeChoice, customWords, removedIds),
    [themeChoice, customWords, removedIds],
  );

  const drawNewWord = useCallback(() => {
    const next = pickWord(pool, lastIdRef.current);
    if (!next) return;
    lastIdRef.current = next.id;
    setCurrent(next);
    setPeeking(false);
    setPhase('peek');
  }, [pool]);

  /* ── timer ── */
  useEffect(() => {
    if (phase !== 'draw' || !timerRunning) return;
    if (endAtRef.current === null) {
      endAtRef.current = Date.now() + secondsLeft * 1000;
    }
    const tick = window.setInterval(() => {
      if (endAtRef.current === null) return;
      const left = Math.max(
        0,
        Math.round((endAtRef.current - Date.now()) / 1000),
      );
      setSecondsLeft(left);
      if (left <= 0) {
        window.clearInterval(tick);
        endAtRef.current = null;
        setTimerRunning(false);
        setTimeUp(true);
        beep();
        try {
          navigator.vibrate?.(250);
        } catch {
          // vibration is best-effort
        }
      }
    }, 200);
    return () => window.clearInterval(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, timerRunning]);

  const startDraw = () => {
    if (!startedRef.current) {
      startedRef.current = true;
      trackEvent('GameStarted', { game: GAME });
    }
    setPeeking(false);
    setSecondsLeft(duration);
    setTimeUp(false);
    endAtRef.current = Date.now() + duration * 1000;
    setTimerRunning(true);
    setRound((r) => r + 1);
    setPhase('draw');
  };

  const toggleTimer = () => {
    if (timeUp) return;
    if (timerRunning) {
      endAtRef.current = null;
      setTimerRunning(false);
    } else {
      endAtRef.current = Date.now() + secondsLeft * 1000;
      setTimerRunning(true);
    }
  };

  const resetTimer = () => {
    setSecondsLeft(duration);
    setTimeUp(false);
    endAtRef.current = timerRunning ? Date.now() + duration * 1000 : null;
  };

  const shown = current ? wordText(current, lang) : '';
  const masked = current ? maskWord(shown) : '';

  const holdProps = {
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      setPeeking(true);
    },
    onPointerUp: () => setPeeking(false),
    onPointerLeave: () => setPeeking(false),
    onPointerCancel: () => setPeeking(false),
    onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
  };

  const manager = themeWords(managerTheme, customWords, removedIds);

  const addCustomWord = () => {
    const text = newWordText.trim();
    if (!text) return;
    const entry = makeCustomWord(managerTheme, text);
    setCustomWords((prev) =>
      prev.some((c) => c.id === entry.id) ? prev : [...prev, entry],
    );
    setNewWordText('');
  };

  const bigBtn =
    'flex min-h-[52px] items-center justify-center gap-2 rounded-2xl px-5 text-base font-semibold transition-colors';
  const chip =
    'flex min-h-[48px] items-center justify-center rounded-full px-4 text-sm font-medium transition-colors';

  return (
    <article className="min-h-screen bg-gradient-to-b from-sky-50 via-background to-background dark:from-sky-950/20 dark:via-background dark:to-background">
      <div className="mx-auto max-w-3xl px-4 py-6">
        <Link
          href="/tools"
          className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-0.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back to Tools
        </Link>

        <h1 className="mt-3 text-3xl font-bold tracking-tight">
          🎨 Draw &amp; Guess <span className="text-blue-600 dark:text-blue-400">你画我猜</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          One phone, pass it around: one person draws, everyone else shouts
          guesses. 一台手机轮流传：一个人画，大家一起猜。
        </p>
        <ol className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <li>1️⃣ Draw a word 抽词</li>
          <li>2️⃣ Peek in secret 偷偷看</li>
          <li>3️⃣ Draw &amp; guess 画与猜</li>
          <li>4️⃣ Reveal 看答案</li>
        </ol>

        {/* ─────────── READY: setup ─────────── */}
        {phase === 'ready' && (
          <section className="mt-6 space-y-5" aria-label="Game setup 游戏设置">
            <div>
              <p className="mb-2 text-sm font-semibold">主题 Theme</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setThemeChoice('all')}
                  className={`${chip} ${themeChoice === 'all' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-100'}`}
                >
                  🎲 全部 All
                </button>
                {WORD_BANK.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setThemeChoice(t.id)}
                    className={`${chip} ${themeChoice === t.id ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-100'}`}
                  >
                    {t.emoji} {t.zh} {t.en}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-6">
              <div>
                <p className="mb-2 text-sm font-semibold">词的语言 Word language</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setLang('zh')}
                    className={`${chip} ${lang === 'zh' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-100'}`}
                  >
                    中文
                  </button>
                  <button
                    type="button"
                    onClick={() => setLang('en')}
                    className={`${chip} ${lang === 'en' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-100'}`}
                  >
                    English
                  </button>
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold">每轮时间 Round time</p>
                <div className="flex gap-2">
                  {DURATIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setDuration(s)}
                      className={`${chip} ${duration === s ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-100'}`}
                    >
                      {s}秒
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-blue-50 px-4 py-3 text-sm dark:bg-blue-950/40">
              <span>
                ⭐ 记分 Tally: <strong>{tally}</strong>
              </span>
              <button
                type="button"
                data-testid="tally-plus-btn"
                onClick={() => setTally((t) => t + 1)}
                className="flex min-h-[48px] min-w-[48px] items-center justify-center rounded-full bg-blue-600 px-4 font-bold text-white"
              >
                +1
              </button>
              <button
                type="button"
                onClick={() => setTally(0)}
                className="text-xs text-muted-foreground underline"
              >
                新对局清零 New game
              </button>
            </div>

            {pool.length === 0 ? (
              <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                词库空了：先在下方词库里恢复默认或加几个词。 The word bank is
                empty — restore defaults or add words below.
              </p>
            ) : (
              <button
                type="button"
                data-testid="draw-word-btn"
                onClick={drawNewWord}
                className={`${bigBtn} w-full bg-blue-600 py-4 text-lg text-white hover:bg-blue-700`}
              >
                🎲 抽词 Draw a word
              </button>
            )}
          </section>
        )}

        {/* ─────────── PEEK: anti-peek word card ─────────── */}
        {phase === 'peek' && current && (
          <section className="mt-6 space-y-4" aria-label="Your word 你的词">
            <p className="text-center text-sm text-muted-foreground">
              把手机给画画的人 · Pass the phone to the drawer 👀
            </p>
            <div
              data-testid="peek-area"
              {...holdProps}
              className="flex min-h-[180px] touch-none select-none flex-col items-center justify-center rounded-3xl border-2 border-dashed border-blue-300 bg-blue-50 px-4 text-center dark:border-blue-800 dark:bg-blue-950/40"
            >
              {peeking ? (
                <span data-testid="word-text" className="text-4xl font-bold">
                  {shown}
                </span>
              ) : (
                <>
                  <span data-testid="word-masked" className="text-4xl tracking-widest">
                    {masked}
                  </span>
                  <span className="mt-3 text-sm text-muted-foreground">
                    按住这里看词 · Press &amp; hold to see your word
                  </span>
                </>
              )}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                data-testid="change-word-btn"
                onClick={drawNewWord}
                className={`${bigBtn} flex-1 bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-950 dark:text-blue-100`}
              >
                🔀 换一词
              </button>
              <button
                type="button"
                data-testid="start-draw-btn"
                onClick={startDraw}
                className={`${bigBtn} flex-[2] bg-blue-600 text-white hover:bg-blue-700`}
              >
                ✏️ 开始画 Start drawing
              </button>
            </div>
          </section>
        )}

        {/* ─────────── DRAW: canvas + masked word strip ─────────── */}
        {phase === 'draw' && current && (
          <section className="mt-4 space-y-3" aria-label="Drawing 画画">
            <div className="flex items-stretch gap-2">
              {/* Masked word strip: hold to peek, release re-masks. The word
                  is only rendered while holding — never as static text. */}
              <div
                data-testid="word-strip"
                {...holdProps}
                className="flex min-h-[52px] flex-1 touch-none select-none items-center justify-center rounded-2xl bg-blue-100 px-3 text-center dark:bg-blue-950"
                aria-label="Hold to check your word 按住看词"
              >
                {peeking ? (
                  <span data-testid="word-text" className="text-xl font-bold">
                    {shown}
                  </span>
                ) : (
                  <span data-testid="word-masked" className="text-lg tracking-widest">
                    {masked}{' '}
                    <span className="text-xs font-normal text-muted-foreground">
                      按住看词
                    </span>
                  </span>
                )}
              </div>
              <div
                data-testid="timer-display"
                className={`flex min-h-[52px] min-w-[92px] items-center justify-center rounded-2xl px-3 text-xl font-bold tabular-nums ${
                  timeUp || secondsLeft <= 10
                    ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                    : 'bg-blue-600 text-white'
                }`}
              >
                {timeUp ? '⏰ 0:00' : `⏱ ${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, '0')}`}
              </div>
            </div>

            {timeUp && (
              <p className="rounded-2xl bg-red-50 px-4 py-2 text-center text-sm font-semibold text-red-700 dark:bg-red-950/40 dark:text-red-300">
                ⏰ 时间到！Time&apos;s up — 点「看答案」揭晓
              </p>
            )}

            <DrawCanvas
              color={color}
              brushFrac={brush.frac}
              erasing={erasing}
              resetSignal={round}
              onStrokeEnd={setStrokeCount}
            />

            {/* Color palette: big thumb blocks */}
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Colors 颜色">
              {COLORS.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  aria-label={c.name}
                  onClick={() => {
                    setColor(c.hex);
                    setErasing(false);
                  }}
                  className={`h-12 w-12 rounded-xl border-2 transition-transform ${
                    !erasing && color === c.hex
                      ? 'scale-110 border-blue-600 ring-2 ring-blue-300'
                      : 'border-black/10'
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
              <button
                type="button"
                data-testid="eraser-btn"
                onClick={() => setErasing(true)}
                className={`${bigBtn} ${erasing ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-100'}`}
              >
                🩹 橡皮
              </button>
            </div>

            {/* Brush size + edit + timer controls: few, big buttons */}
            <div className="flex flex-wrap gap-2">
              {BRUSHES.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBrush(b)}
                  className={`${bigBtn} flex-1 ${brush.id === b.id ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-100'}`}
                >
                  <span
                    className="inline-block rounded-full bg-current"
                    style={{ width: b.dot, height: b.dot }}
                  />
                  {b.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                data-testid="undo-btn"
                disabled={strokeCount === 0}
                onClick={() => canvasAction('undo')}
                className={`${bigBtn} flex-1 bg-blue-100 text-blue-900 disabled:opacity-40 dark:bg-blue-950 dark:text-blue-100`}
              >
                ↩️ 撤销
              </button>
              <button
                type="button"
                disabled={strokeCount === 0}
                onClick={() => canvasAction('clear')}
                className={`${bigBtn} flex-1 bg-blue-100 text-blue-900 disabled:opacity-40 dark:bg-blue-950 dark:text-blue-100`}
              >
                🗑 清空
              </button>
              <button
                type="button"
                onClick={toggleTimer}
                className={`${bigBtn} flex-1 bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-100`}
              >
                {timerRunning ? '⏸ 暂停' : '▶️ 继续'}
              </button>
              <button
                type="button"
                onClick={resetTimer}
                className={`${bigBtn} flex-1 bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-100`}
              >
                🔄 计时
              </button>
            </div>

            <button
              type="button"
              data-testid="reveal-btn"
              onClick={() => {
                setPeeking(false);
                setTimerRunning(false);
                endAtRef.current = null;
                setPhase('reveal');
              }}
              className={`${bigBtn} w-full bg-blue-600 py-4 text-lg text-white hover:bg-blue-700`}
            >
              👀 看答案 Reveal answer
            </button>
          </section>
        )}

        {/* ─────────── REVEAL ─────────── */}
        {phase === 'reveal' && current && (
          <section className="mt-6 space-y-4 text-center" aria-label="Answer 答案">
            <p className="text-sm text-muted-foreground">答案是 · The word was</p>
            <div
              data-testid="reveal-word"
              className="rounded-3xl bg-blue-50 px-4 py-8 dark:bg-blue-950/40"
            >
              <span className="text-4xl font-bold">{shown}</span>
              <span className="mt-2 block text-lg text-muted-foreground">
                {lang === 'zh' ? current.en : current.zh}
              </span>
            </div>
            <div className="flex items-center justify-center gap-3 text-sm">
              <span>
                ⭐ 记分 Tally: <strong>{tally}</strong>
              </span>
              <button
                type="button"
                data-testid="tally-plus-btn"
                onClick={() => setTally((t) => t + 1)}
                className="flex min-h-[48px] min-w-[48px] items-center justify-center rounded-full bg-blue-600 px-4 font-bold text-white"
              >
                猜对了 +1
              </button>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                data-testid="back-setup-btn"
                onClick={() => setPhase('ready')}
                className={`${bigBtn} flex-1 bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-950 dark:text-blue-100`}
              >
                ⚙️ 设置
              </button>
              <button
                type="button"
                data-testid="next-round-btn"
                onClick={drawNewWord}
                className={`${bigBtn} flex-[2] bg-blue-600 text-white hover:bg-blue-700`}
              >
                ➡️ 下一轮 Next round
              </button>
            </div>
          </section>
        )}

        {/* ─────────── Word bank manager (hidden while a word is secret) ─────────── */}
        {(phase === 'ready' || phase === 'reveal') && (
          <section className="mt-10" aria-label="Word bank 词库">
            <h2 className="text-lg font-bold">📚 词库 Word Bank</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              加自己的词、删不想画的词，都会存在这台手机上，下次打开还在。
              Custom words are saved on this phone and join the draw right away.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {WORD_BANK.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setManagerTheme(t.id)}
                  className={`${chip} ${managerTheme === t.id ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-100'}`}
                >
                  {t.emoji} {t.zh} {t.en}
                </button>
              ))}
            </div>

            <div className="mt-3 flex gap-2">
              <input
                value={newWordText}
                onChange={(e) => setNewWordText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addCustomWord();
                }}
                placeholder={`加一个词到「${themeById(managerTheme).zh}」…`}
                aria-label="New word 新词"
                className="min-h-[52px] flex-1 rounded-2xl border border-blue-200 bg-background px-4 text-base dark:border-blue-900"
              />
              <button
                type="button"
                data-testid="add-word-btn"
                onClick={addCustomWord}
                className={`${bigBtn} bg-blue-600 text-white hover:bg-blue-700`}
              >
                ＋ 加词
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {manager.builtin.map((entry) => (
                <span
                  key={entry.id}
                  className="inline-flex min-h-[40px] items-center gap-1 rounded-full bg-blue-50 py-1 pl-3 pr-1 text-sm dark:bg-blue-950/40"
                >
                  {entry.zh} · {entry.en}
                  <button
                    type="button"
                    aria-label={`删除 ${entry.zh}`}
                    onClick={() =>
                      setRemovedIds((prev) => [...prev, entry.id])
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-blue-100 hover:text-foreground dark:hover:bg-blue-900"
                  >
                    ×
                  </button>
                </span>
              ))}
              {manager.custom.map((c) => (
                <span
                  key={c.id}
                  className="inline-flex min-h-[40px] items-center gap-1 rounded-full bg-emerald-50 py-1 pl-3 pr-1 text-sm dark:bg-emerald-950/40"
                >
                  {c.text} <span className="text-xs text-emerald-600">自加</span>
                  <button
                    type="button"
                    aria-label={`删除 ${c.text}`}
                    onClick={() =>
                      setCustomWords((prev) => prev.filter((x) => x.id !== c.id))
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-emerald-100 hover:text-foreground dark:hover:bg-emerald-900"
                  >
                    ×
                  </button>
                </span>
              ))}
              {manager.builtin.length === 0 && manager.custom.length === 0 && (
                <span className="text-sm text-muted-foreground">
                  这个主题暂时没词了。
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setCustomWords([]);
                setRemovedIds([]);
              }}
              className="mt-3 text-xs text-muted-foreground underline"
            >
              恢复默认词库 Restore defaults
            </button>
          </section>
        )}

        <div className="mb-10 mt-12">
          <UsefulnessFeedback
            page="tools-draw-guess"
            prompt="Was this game fun?"
            helper="One click helps us build more free family games."
          />
        </div>
        <div className="pb-8 text-center">
          <p className="text-xs text-muted-foreground/50">
            Words and scores are saved in this browser only. No data collected.
            Runs entirely on your device.
          </p>
        </div>
      </div>
    </article>
  );
}
