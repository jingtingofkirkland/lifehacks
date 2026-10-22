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
    // The in-progress stroke is not committed yet, but a bitmap reset
    // (any resize reassigns canvas.width, which wipes the bitmap) must
    // not make it vanish mid-draw — replay it on top.
    if (currentRef.current) drawStroke(ctx, currentRef.current, w, h);
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

  // Guarantee the bitmap matches the on-screen box (CSS size × DPR)
  // before a stroke starts. A stroke painted into a stale or default
  // (300×150) bitmap lands off-canvas and is lost; combined with a
  // resize wiping the bitmap mid-stroke, that made the first stroke
  // after entering the draw screen intermittently invisible.
  const ensureReady = useCallback(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = Math.round(wrap.clientWidth * dpr);
    const h = Math.round(wrap.clientHeight * dpr);
    if (w === 0 || h === 0) return;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      redraw();
    }
  }, [redraw]);

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
    ensureReady();
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // Capture keeps a fast stroke alive off-element; drawing still
      // works without it, so never fail the stroke over it.
    }
    drawingRef.current = true;
    const stroke: Stroke = {
      color: erasing ? null : color,
      frac: brushFrac,
      points: [pos(e)],
    };
    currentRef.current = stroke;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      // Paint the first dot with an explicitly set DPR transform rather
      // than whatever state a previous redraw happened to leave behind.
      const dpr = window.devicePixelRatio || 1;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawStroke(ctx, stroke, canvas.clientWidth, canvas.clientHeight);
    }
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
      // Repaint unconditionally: if a resize wiped the bitmap mid-stroke
      // the incremental painting is gone, and only this redraw shows
      // the finished stroke.
      redraw();
    }
    currentRef.current = null;
  };

  return (
    <div
      ref={wrapRef}
      className="relative h-full w-full overflow-hidden rounded-2xl border-2 border-blue-200 bg-white [overscroll-behavior:none] dark:border-blue-900"
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

/* ═══════════════════════ Main game ═══════════════════════
   The stage is canvas + drawing tools only. Everything about the word —
   peeking, skipping, revealing, settings, tally, the word bank — lives
   in a right-hand sidebar that overlays the stage and never resizes it.
   The sidebar starts open so the drawer can peek first; closing it (by
   any route) starts the round timer. */

export default function DrawGuess() {
  const [themeChoice, setThemeChoice] = useState<ThemeChoice>('all');
  const [lang, setLang] = useState<Lang>('zh');
  const [duration, setDuration] = useState(90);
  const [current, setCurrent] = useState<WordEntry | null>(null);
  const [peeking, setPeeking] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(90);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [roundStarted, setRoundStarted] = useState(false);
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
  const roundStartedRef = useRef(false);

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

  /* Gesture hardening, scoped to this page (set on mount, restored on
     unmount): html/body overscroll fully off so pull-to-refresh and
     scroll chaining cannot fire mid-draw, and the body is scroll-locked
     with position:fixed as a fallback under the canvas's own
     touch-action:none + preventDefault. Layer 3 of the anti-refresh
     stack (the others: touch-action, preventDefault, fullscreen). */
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prev = {
      htmlOverscroll: html.style.overscrollBehavior,
      bodyOverscroll: body.style.overscrollBehavior,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyLeft: body.style.left,
      bodyRight: body.style.right,
      bodyWidth: body.style.width,
    };
    const scrollY = window.scrollY;
    html.style.overscrollBehavior = 'none';
    body.style.overscrollBehavior = 'none';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    return () => {
      html.style.overscrollBehavior = prev.htmlOverscroll;
      body.style.overscrollBehavior = prev.bodyOverscroll;
      body.style.position = prev.bodyPosition;
      body.style.top = prev.bodyTop;
      body.style.left = prev.bodyLeft;
      body.style.right = prev.bodyRight;
      body.style.width = prev.bodyWidth;
      window.scrollTo(0, scrollY);
    };
  }, []);

  /* ── Fullscreen + landscape lock + wake lock (all best-effort) ──
     Every API here is feature-detected and wrapped: fullscreen is
     unavailable for non-video elements on iPhone Safari, orientation
     lock needs fullscreen on Chrome/Android, wake lock can be denied —
     any failure degrades silently to the scroll-lock layer and never
     interrupts the game. */
  const [isFullscreen, setIsFullscreen] = useState(false);
  const wakeLockRef = useRef<{ released: boolean; release: () => Promise<void> } | null>(null);

  useEffect(() => {
    const onFsChange = () =>
      setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const requestWakeLock = useCallback(async () => {
    try {
      const nav = navigator as unknown as {
        wakeLock?: {
          request: (
            type: 'screen',
          ) => Promise<{ released: boolean; release: () => Promise<void> }>;
        };
      };
      if (!nav.wakeLock || typeof nav.wakeLock.request !== 'function') return;
      if (wakeLockRef.current && !wakeLockRef.current.released) return;
      wakeLockRef.current = await nav.wakeLock.request('screen');
    } catch {
      // Denied or unsupported — the screen may dim; the game goes on.
    }
  }, []);

  const releaseWakeLock = useCallback(() => {
    const sentinel = wakeLockRef.current;
    wakeLockRef.current = null;
    if (sentinel) {
      sentinel.release().catch(() => {
        // Already released by the browser — nothing to clean up.
      });
    }
  }, []);

  // Hold a wake lock while fullscreen or while a round is being drawn;
  // release it as soon as neither applies, and on unmount (no leaks).
  useEffect(() => {
    if (isFullscreen || roundStarted) {
      void requestWakeLock();
    } else {
      releaseWakeLock();
    }
  }, [isFullscreen, roundStarted, requestWakeLock, releaseWakeLock]);

  useEffect(() => () => releaseWakeLock(), [releaseWakeLock]);

  // The browser drops the wake lock when the page hides; re-acquire on
  // return if the game is still in a drawing state.
  useEffect(() => {
    const onVisibility = () => {
      if (
        document.visibilityState === 'visible' &&
        (isFullscreen || roundStartedRef.current)
      ) {
        void requestWakeLock();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () =>
      document.removeEventListener('visibilitychange', onVisibility);
  }, [isFullscreen, requestWakeLock]);

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        return;
      }
      const el = document.documentElement;
      if (typeof el.requestFullscreen !== 'function') return;
      await el.requestFullscreen();
      // Chrome/Android: fullscreen also disables pull-to-refresh. Lock
      // landscape so the canvas gets the wide side; failure is fine.
      try {
        const orientation = screen.orientation as unknown as
          | { lock?: (o: string) => Promise<void> }
          | undefined;
        if (orientation && typeof orientation.lock === 'function') {
          await orientation.lock('landscape');
        }
      } catch {
        // Not allowed here — portrait fullscreen still works.
      }
    } catch {
      // Fullscreen rejected (e.g. iPhone Safari) — scroll lock carries on.
    }
  };

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
    setRevealed(false);
  }, [pool]);

  // The first word is ready as soon as storage is hydrated, so the open
  // sidebar already holds a masked word when the page lands.
  useEffect(() => {
    if (hydrated && !current) drawNewWord();
  }, [hydrated, current, drawNewWord]);

  // Changing theme before a round has started re-draws from the new
  // pool; mid-round it simply applies from the next round.
  const themeChoiceRef = useRef(themeChoice);
  useEffect(() => {
    if (themeChoiceRef.current === themeChoice) return;
    themeChoiceRef.current = themeChoice;
    if (current && !roundStartedRef.current) drawNewWord();
  }, [themeChoice, current, drawNewWord]);

  /* ── timer ── */
  useEffect(() => {
    if (!timerRunning) return;
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
  }, [timerRunning]);

  const beginRound = () => {
    if (!startedRef.current) {
      startedRef.current = true;
      trackEvent('GameStarted', { game: GAME });
    }
    roundStartedRef.current = true;
    setRoundStarted(true);
    setSecondsLeft(duration);
    setTimeUp(false);
    endAtRef.current = Date.now() + duration * 1000;
    setTimerRunning(true);
  };

  const resumeTimer = () => {
    endAtRef.current = Date.now() + secondsLeft * 1000;
    setTimerRunning(true);
  };

  // Closing the sidebar is the "start drawing" moment: the first close
  // of a round starts its timer; reopening to peek or skip never
  // restarts it. The big Start button additionally resumes a pause.
  const closeSidebar = (viaStart: boolean) => {
    setPeeking(false);
    setSidebarOpen(false);
    if (!current || revealed || timeUp) return;
    if (!roundStartedRef.current) {
      beginRound();
    } else if (viaStart && !timerRunning) {
      resumeTimer();
    }
  };

  const toggleTimer = () => {
    if (timeUp) return;
    if (timerRunning) {
      endAtRef.current = null;
      setTimerRunning(false);
    } else if (roundStartedRef.current) {
      resumeTimer();
    }
  };

  const resetTimer = () => {
    setSecondsLeft(duration);
    setTimeUp(false);
    endAtRef.current = timerRunning ? Date.now() + duration * 1000 : null;
  };

  // Skip: swap the word (pickWord excludes the skipped one), keep the
  // canvas and the clock exactly as they are.
  const skipWord = () => {
    drawNewWord();
  };

  const revealAnswer = () => {
    setPeeking(false);
    setTimerRunning(false);
    endAtRef.current = null;
    setRevealed(true);
  };

  const nextRound = () => {
    setTimerRunning(false);
    endAtRef.current = null;
    setTimeUp(false);
    setSecondsLeft(duration);
    roundStartedRef.current = false;
    setRoundStarted(false);
    setRound((r) => r + 1); // clears the canvas via resetSignal
    drawNewWord();
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
  const toolBtn =
    'flex h-12 min-w-0 flex-1 items-center justify-center gap-1 rounded-2xl px-2 text-sm font-semibold transition-colors';
  const idleBtn =
    'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-100';
  const timerText = timeUp
    ? '⏰ 0:00'
    : `${roundStarted && !timerRunning ? '⏸' : '⏱'} ${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, '0')}`;

  return (
    <section
      aria-label="Draw and Guess game 你画我猜"
      className="fixed inset-0 z-[60] flex overflow-hidden bg-gradient-to-b from-sky-50 via-background to-background dark:from-sky-950/40 dark:via-background dark:to-background"
      style={{ overscrollBehavior: 'none' }}
    >
      <div className="mx-auto flex h-full w-full min-w-0 max-w-3xl flex-1 flex-col px-2 py-2 sm:px-4">
        {/* Top bar: fixed height in every state — exit + minimal timer. */}
        <div className="flex h-14 shrink-0 items-center gap-2">
          <Link
            href="/tools"
            aria-label="Back to Tools 返回工具"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-lg text-blue-900 transition-colors dark:bg-blue-950 dark:text-blue-100"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
          <span className="min-w-0 flex-1 truncate text-base font-bold">
            🎨 你画我猜{' '}
            <span className="hidden text-sm font-medium text-muted-foreground sm:inline">
              Draw &amp; Guess
            </span>
          </span>
          <div
            data-testid="timer-display"
            className={`flex h-12 w-[104px] shrink-0 items-center justify-center rounded-2xl text-xl font-bold tabular-nums ${
              timeUp || (roundStarted && secondsLeft <= 10)
                ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                : 'bg-blue-600 text-white'
            }`}
          >
            {timerText}
          </div>
        </div>

        {/* Canvas fills every remaining pixel. The time-up banner is an
            overlay inside this box, never in the document flow. */}
        <div className="relative min-h-0 flex-1">
          <DrawCanvas
            color={color}
            brushFrac={brush.frac}
            erasing={erasing}
            resetSignal={round}
            onStrokeEnd={setStrokeCount}
          />
          {timeUp && (
            <p
              data-testid="timeup-banner"
              className="pointer-events-none absolute left-1/2 top-3 z-10 w-max max-w-[92%] -translate-x-1/2 rounded-2xl bg-red-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-lg"
            >
              ⏰ 时间到！Time&apos;s up — 打开右边词卡看答案
            </p>
          )}
        </div>

        {/* Bottom toolbar: three fixed-height rows that never wrap, so
            the canvas above them can never be pushed around. */}
        <div className="shrink-0 space-y-2 pt-2">
          <div className="flex h-14 items-center gap-1.5" role="group" aria-label="Colors 颜色">
            {COLORS.map((c) => (
              <button
                key={c.hex}
                type="button"
                aria-label={c.name}
                aria-pressed={!erasing && color === c.hex}
                onClick={() => {
                  setColor(c.hex);
                  setErasing(false);
                }}
                className={`h-12 min-w-0 flex-1 rounded-xl border-2 ${
                  !erasing && color === c.hex
                    ? 'border-blue-600 ring-2 ring-blue-500 ring-offset-1 ring-offset-white dark:ring-offset-slate-900'
                    : 'border-black/10'
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
          <div className="flex h-14 items-center gap-2">
            <button
              type="button"
              data-testid="eraser-btn"
              aria-pressed={erasing}
              onClick={() => setErasing(true)}
              className={`${toolBtn} ${erasing ? 'bg-blue-600 text-white' : idleBtn}`}
            >
              🩹 橡皮
            </button>
            <button
              type="button"
              data-testid="undo-btn"
              disabled={strokeCount === 0}
              onClick={() => canvasAction('undo')}
              className={`${toolBtn} ${idleBtn} disabled:opacity-40`}
            >
              ↩️ 撤销
            </button>
            <button
              type="button"
              data-testid="clear-btn"
              disabled={strokeCount === 0}
              onClick={() => canvasAction('clear')}
              className={`${toolBtn} ${idleBtn} disabled:opacity-40`}
            >
              🗑 清空
            </button>
          </div>
          <div className="flex h-14 items-center gap-2" role="group" aria-label="Brush size 笔粗">
            {BRUSHES.map((b) => (
              <button
                key={b.id}
                type="button"
                aria-pressed={brush.id === b.id}
                onClick={() => setBrush(b)}
                className={`${toolBtn} ${brush.id === b.id ? 'bg-blue-600 text-white' : idleBtn}`}
              >
                <span
                  className="inline-block shrink-0 rounded-full bg-current"
                  style={{ width: b.dot, height: b.dot }}
                />
                {b.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─────────── Right sidebar: everything about the word ─────────── */}
      {sidebarOpen && (
        <button
          type="button"
          data-testid="word-sidebar-scrim"
          aria-label="关闭侧边栏 Close panel"
          onClick={() => closeSidebar(false)}
          className="absolute inset-0 z-20 h-full w-full cursor-default bg-slate-900/30 landscape:hidden"
        />
      )}
      <aside
        id="word-sidebar"
        data-testid="word-sidebar"
        role="region"
        aria-label="词卡与设置 Word card and settings"
        aria-hidden={!sidebarOpen}
        className={`absolute inset-y-0 right-0 z-30 flex w-[320px] max-w-[88vw] flex-col bg-white shadow-2xl transition-all duration-200 ease-out dark:bg-slate-900 landscape:relative landscape:inset-auto landscape:z-auto landscape:h-full landscape:max-w-none landscape:border-l-2 landscape:border-blue-100 landscape:shadow-none dark:landscape:border-blue-900 ${
          sidebarOpen
            ? 'translate-x-0 landscape:w-[320px]'
            : 'pointer-events-none translate-x-[105%] landscape:w-0 landscape:translate-x-0 landscape:overflow-hidden landscape:border-l-0'
        }`}
      >
        <div className="flex shrink-0 items-start justify-between gap-2 px-4 pb-1 pt-4">
          <div className="min-w-0">
            <h1 className="text-xl font-bold">
              🎨 Draw &amp; Guess{' '}
              <span className="text-blue-600 dark:text-blue-400">你画我猜</span>
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              一个人偷偷看词画画，大家一起猜 · One secret word, one drawing,
              everyone guesses out loud.
            </p>
          </div>
          <button
            type="button"
            data-testid="word-sidebar-close"
            onClick={() => closeSidebar(false)}
            aria-label="关闭侧边栏 Close"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg text-blue-900 transition-colors dark:bg-blue-950 dark:text-blue-100"
          >
            ✕
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain px-4 pb-6 pt-2">
          {/* Word card: masked by dots, hold to peek, release re-masks. */}
          <section aria-label="Your word 你的词">
            {current ? (
              revealed ? (
                <div
                  data-testid="reveal-word"
                  className="rounded-3xl bg-blue-50 px-4 py-6 text-center dark:bg-blue-950/40"
                >
                  <p className="text-xs text-muted-foreground">
                    答案是 · The word was
                  </p>
                  <span data-testid="word-text" className="mt-1 block text-4xl font-bold">
                    {shown}
                  </span>
                  <span className="mt-1 block text-base text-muted-foreground">
                    {lang === 'zh' ? current.en : current.zh}
                  </span>
                </div>
              ) : (
                <div
                  data-testid="sidebar-peek-area"
                  {...holdProps}
                  className="flex min-h-[150px] touch-none select-none flex-col items-center justify-center rounded-3xl border-2 border-dashed border-blue-300 bg-blue-50 px-4 text-center dark:border-blue-800 dark:bg-blue-950/40"
                >
                  {peeking ? (
                    <span data-testid="word-text" className="text-4xl font-bold">
                      {shown}
                    </span>
                  ) : (
                    <>
                      <span data-testid="word-masked" className="text-3xl tracking-widest">
                        {masked}
                      </span>
                      <span className="mt-3 text-sm text-muted-foreground">
                        按住这里看词 · Press &amp; hold to peek
                      </span>
                    </>
                  )}
                </div>
              )
            ) : (
              <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                词库空了：先在下方词库里恢复默认或加几个词。 The word bank is
                empty — restore defaults or add words below.
              </p>
            )}

            {current && (
              <button
                type="button"
                data-testid="fullscreen-btn"
                onClick={() => void toggleFullscreen()}
                className={`${bigBtn} mt-3 w-full bg-slate-800 py-3 text-lg text-white hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600`}
              >
                {isFullscreen
                  ? '🚪 退出全屏 Exit fullscreen'
                  : '🖥 全屏开始（横屏更好画）'}
              </button>
            )}

            {current && !revealed && (
              <div className="mt-3 space-y-2">
                <button
                  type="button"
                  data-testid="start-draw-btn"
                  onClick={() => closeSidebar(true)}
                  className={`${bigBtn} w-full bg-blue-600 py-3 text-lg text-white hover:bg-blue-700`}
                >
                  ✏️ {roundStarted ? '继续画 Keep drawing' : '开始画 Start drawing'}
                </button>
                <button
                  type="button"
                  data-testid="skip-word-btn"
                  onClick={skipWord}
                  className={`${bigBtn} w-full border-2 border-amber-300 bg-amber-50 py-3 text-lg text-amber-900 hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-100`}
                >
                  ⏭ 跳过 / 下一个词 Skip
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    data-testid="pause-btn"
                    onClick={toggleTimer}
                    disabled={!roundStarted || timeUp}
                    className={`${bigBtn} min-w-0 flex-1 px-2 text-sm ${idleBtn} disabled:opacity-40`}
                  >
                    {timerRunning ? '⏸ 暂停' : '▶️ 继续'}
                  </button>
                  <button
                    type="button"
                    data-testid="timer-reset-btn"
                    onClick={resetTimer}
                    className={`${bigBtn} min-w-0 flex-1 px-2 text-sm ${idleBtn}`}
                  >
                    🔄 计时
                  </button>
                  <button
                    type="button"
                    data-testid="reveal-btn"
                    onClick={revealAnswer}
                    className={`${bigBtn} min-w-0 flex-1 px-2 text-sm ${idleBtn}`}
                  >
                    👀 揭晓
                  </button>
                </div>
              </div>
            )}
            {current && revealed && (
              <div className="mt-3 space-y-2">
                <button
                  type="button"
                  data-testid="tally-plus-btn"
                  onClick={() => setTally((t) => t + 1)}
                  className={`${bigBtn} w-full bg-emerald-600 py-3 text-lg text-white hover:bg-emerald-700`}
                >
                  🎉 猜对了 +1
                </button>
                <button
                  type="button"
                  data-testid="next-round-btn"
                  onClick={nextRound}
                  className={`${bigBtn} w-full bg-blue-600 py-3 text-lg text-white hover:bg-blue-700`}
                >
                  ➡️ 下一轮 Next round
                </button>
              </div>
            )}
          </section>

          {/* Tally */}
          <section
            aria-label="Tally 记分"
            className="flex items-center gap-3 rounded-2xl bg-blue-50 px-4 py-3 text-sm dark:bg-blue-950/40"
          >
            <span>
              ⭐ 记分 Tally: <strong data-testid="tally-count">{tally}</strong>
            </span>
            <button
              type="button"
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
          </section>

          {/* Settings */}
          <section aria-label="Settings 设置" className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-semibold">主题 Theme</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setThemeChoice('all')}
                  className={`${chip} ${themeChoice === 'all' ? 'bg-blue-600 text-white' : idleBtn}`}
                >
                  🎲 全部 All
                </button>
                {WORD_BANK.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setThemeChoice(t.id)}
                    className={`${chip} ${themeChoice === t.id ? 'bg-blue-600 text-white' : idleBtn}`}
                  >
                    {t.emoji} {t.zh} {t.en}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold">词的语言 Word language</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setLang('zh')}
                  className={`${chip} ${lang === 'zh' ? 'bg-blue-600 text-white' : idleBtn}`}
                >
                  中文
                </button>
                <button
                  type="button"
                  onClick={() => setLang('en')}
                  className={`${chip} ${lang === 'en' ? 'bg-blue-600 text-white' : idleBtn}`}
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
                    onClick={() => {
                      setDuration(s);
                      if (!roundStartedRef.current) {
                        setSecondsLeft(s);
                        setTimeUp(false);
                      }
                    }}
                    className={`${chip} ${duration === s ? 'bg-blue-600 text-white' : idleBtn}`}
                  >
                    {s}秒
                  </button>
                ))}
              </div>
              {roundStarted && (
                <p className="mt-2 text-xs text-muted-foreground">
                  主题和时长下一轮生效 · Theme &amp; time apply next round
                </p>
              )}
            </div>
          </section>

          {/* Word bank manager (spoiler content — sidebar only) */}
          <section aria-label="Word bank 词库">
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
                  className={`${chip} ${managerTheme === t.id ? 'bg-blue-600 text-white' : idleBtn}`}
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
                className="min-h-[52px] min-w-0 flex-1 rounded-2xl border border-blue-200 bg-background px-4 text-base dark:border-blue-900"
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

          <UsefulnessFeedback
            page="tools-draw-guess"
            prompt="Was this game fun?"
            helper="One click helps us build more free family games."
          />
          <p className="pb-2 text-center text-xs text-muted-foreground/50">
            Words and scores are saved in this browser only. No data collected.
            Runs entirely on your device.
          </p>
        </div>
      </aside>

      {/* Sidebar handle: always on the right edge, follows the panel, and
          never carries the word itself. */}
      <button
        type="button"
        data-testid="word-sidebar-handle"
        aria-expanded={sidebarOpen}
        aria-controls="word-sidebar"
        aria-label="词卡与设置 Word and settings"
        onClick={() => (sidebarOpen ? closeSidebar(false) : setSidebarOpen(true))}
        style={{ right: sidebarOpen ? 'min(320px, 88vw)' : 0 }}
        className="absolute top-[38%] z-30 flex min-h-[72px] w-12 flex-col items-center justify-center gap-1 rounded-l-2xl bg-blue-600 py-3 text-white shadow-lg transition-[right] duration-200 ease-out"
      >
        <span className="text-lg leading-none">🔤</span>
        <span className="text-sm font-bold leading-none">词</span>
        <span className="text-[10px] font-medium leading-none">word</span>
      </button>
    </section>
  );
}
