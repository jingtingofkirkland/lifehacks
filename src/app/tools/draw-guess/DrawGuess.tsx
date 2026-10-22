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

const DURATIONS = [30, 60, 90, 120];

/** Round flow (mirrors the local playtest version's phases):
 *  pass — word masked in the sidebar, hand the phone to the drawer;
 *  show — the drawer is looking at the word;
 *  draw — sidebar closed, timer running, floating verdict buttons;
 *  result — answer revealed in the sidebar, tally / next round. */
type Phase = 'pass' | 'show' | 'draw' | 'result';
type ResultKind = 'hit' | 'miss' | 'reveal';

interface Stroke {
  color: string | null; // null = eraser
  frac: number;
  points: { x: number; y: number }[];
}

function beep(times = 2) {
  try {
    const Ctx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    Array.from({ length: times }, (_, i) => i * 0.22).forEach((offset) => {
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
    window.setTimeout(() => void ctx.close(), 700 + times * 220);
  } catch {
    // Sound is a nicety; never break the game over it.
  }
}

/**
 * Swap-feedback chime: two quick rising tones for "new word ready",
 * one low, longer tone when the pool is empty — distinguishable with
 * your eyes closed, which is the whole point of the feedback.
 */
function swapChime(ok: boolean) {
  try {
    const Ctx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const notes: { freq: number; at: number; dur: number }[] = ok
      ? [
          { freq: 880, at: 0, dur: 0.1 },
          { freq: 1318, at: 0.09, dur: 0.16 },
        ]
      : [{ freq: 220, at: 0, dur: 0.3 }];
    for (const n of notes) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = n.freq;
      gain.gain.setValueAtTime(0.18, ctx.currentTime + n.at);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + n.at + n.dur,
      );
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + n.at);
      osc.stop(ctx.currentTime + n.at + n.dur + 0.02);
    }
    window.setTimeout(() => void ctx.close(), 800);
  } catch {
    // Sound is a nicety; never break the game over it.
  }
}

/* ═══════════════════════ Drawing canvas ═══════════════════════ */

function DrawCanvas({
  color,
  brushFrac,
  erasing,
  enabled,
  resetSignal,
  onStrokeEnd,
}: {
  color: string;
  brushFrac: number;
  erasing: boolean;
  enabled: boolean;
  resetSignal: number;
  onStrokeEnd: (count: number) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const currentRef = useRef<Stroke | null>(null);
  const drawingRef = useRef(false);
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

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
      // Smooth through midpoints (quadratic curves) — the local playtest
      // version's strokes felt noticeably less jagged for this reason.
      // Two-point segments (the incremental live paint) stay straight.
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length - 1; i += 1) {
        const mx = (pts[i].x + pts[i + 1].x) / 2;
        const my = (pts[i].y + pts[i + 1].y) / 2;
        ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
      }
      ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
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
    // The board only takes strokes during the draw phase — before that
    // it sits behind the word sidebar as a pure preview surface.
    if (!enabledRef.current) return;
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
   looking, skipping, revealing, settings, tally, the word bank — lives
   in a right-hand sidebar that OVERLAYS the stage in both orientations
   and never resizes it. The toolbar is a single node that CSS moves:
   three rows under the canvas in portrait, a slim vertical rail on the
   right in landscape, so the canvas owns the landscape height. The
   sidebar starts open (phase "pass") so the drawer can look at the
   word first; "记住了，遮住开画" closes it and starts the round. */

export default function DrawGuess() {
  const [themeChoice, setThemeChoice] = useState<ThemeChoice>('all');
  const [lang, setLang] = useState<Lang>('zh');
  const [duration, setDuration] = useState(90);
  // Unlimited rounds: a separate mode, not a giant duration — the
  // clock counts up from zero and can never run out. `clockUnlimited`
  // is the mode the LIVE round locked in at beginRound; `unlimited`
  // is the chip selection, which only takes effect next round.
  const [unlimited, setUnlimited] = useState(false);
  const [clockUnlimited, setClockUnlimited] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [swapFx, setSwapFx] = useState<'ok' | 'empty' | null>(null);
  const [backHint, setBackHint] = useState(false);
  const [current, setCurrent] = useState<WordEntry | null>(null);
  const [phase, setPhase] = useState<Phase>('pass');
  const [resultKind, setResultKind] = useState<ResultKind>('reveal');
  const [peeking, setPeeking] = useState(false);
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
  const [clearArmed, setClearArmed] = useState(false);

  const [customWords, setCustomWords] = useState<CustomWord[]>([]);
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [managerTheme, setManagerTheme] = useState<ThemeId>('animals');
  const [newWordText, setNewWordText] = useState('');
  const [newWordEn, setNewWordEn] = useState('');

  const lastIdRef = useRef<string | null>(null);
  const startedRef = useRef(false);
  const endAtRef = useRef<number | null>(null);
  const roundStartedRef = useRef(false);
  const clockUnlimitedRef = useRef(false);
  const elapsedBaseRef = useRef(0);
  const countStartRef = useRef<number | null>(null);
  const elapsedRef = useRef(0);
  elapsedRef.current = elapsed;
  const swapFxTimerRef = useRef<number | null>(null);
  // Back-button guard (live round only): beginRound pushes one
  // sentinel history entry; the popstate effect below decides what a
  // back press means while the sentinel is up.
  const guardLiveRef = useRef(false);
  const guardSentinelRef = useRef(false);
  const guardArmedRef = useRef(false);
  const guardArmTimerRef = useRef<number | null>(null);

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

  const enterFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) return;
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
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        return;
      }
      await enterFullscreen();
    } catch {
      // Fullscreen rejected — scroll lock carries on.
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
    if (clockUnlimitedRef.current) {
      // Unlimited: count UP from the folded base. There is no endAt
      // and no time-up branch — the round ends only when somebody
      // taps 猜对啦 / 没猜出来 / 看答案.
      if (countStartRef.current === null) {
        countStartRef.current = Date.now();
      }
      const tickUp = window.setInterval(() => {
        if (countStartRef.current === null) return;
        setElapsed(
          elapsedBaseRef.current +
            Math.floor((Date.now() - countStartRef.current) / 1000),
        );
      }, 250);
      return () => window.clearInterval(tickUp);
    }
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
    setTimeUp(false);
    // The clock mode locks in for this round: touching the duration
    // chips mid-round only takes effect from the NEXT round.
    clockUnlimitedRef.current = unlimited;
    setClockUnlimited(unlimited);
    if (unlimited) {
      setElapsed(0);
      elapsedBaseRef.current = 0;
      countStartRef.current = Date.now();
      endAtRef.current = null;
    } else {
      setSecondsLeft(duration);
      endAtRef.current = Date.now() + duration * 1000;
    }
    setTimerRunning(true);
    // A live round arms the back-button guard: one sentinel history
    // entry now stands between this round and an accidental exit.
    guardLiveRef.current = true;
    if (!guardSentinelRef.current) {
      guardSentinelRef.current = true;
      window.history.pushState({ drawGuessGuard: true }, '');
    }
  };

  const resumeTimer = () => {
    if (clockUnlimitedRef.current) {
      countStartRef.current = Date.now();
    } else {
      endAtRef.current = Date.now() + secondsLeft * 1000;
    }
    setTimerRunning(true);
  };

  /* "遮住开画" — the draw phase entry point. It deliberately does
     NOT enter fullscreen: fullscreen is the fullscreen button's job
     and nothing else's (user correction 2026-10-21 — an earlier
     merged behavior auto-fullscreened here and surprised people).
     Closing the sidebar by any route before the round has started
     means the same thing: the drawer is done looking, start the
     clock. */
  const startDraw = () => {
    setPeeking(false);
    setSidebarOpen(false);
    if (!current || phase === 'result') return;
    setPhase('draw');
    if (!roundStartedRef.current) {
      beginRound();
    } else if (!timerRunning && !timeUp) {
      resumeTimer();
    }
  };

  const closeSidebar = (viaStart: boolean) => {
    setPeeking(false);
    setSidebarOpen(false);
    if (!current || phase === 'result') return;
    if (phase === 'pass' || phase === 'show') {
      startDraw();
    } else if (viaStart && !timerRunning && !timeUp) {
      resumeTimer();
    }
  };

  const toggleTimer = () => {
    if (timeUp) return;
    if (timerRunning) {
      if (clockUnlimitedRef.current) {
        // Fold the running count-up segment into the base so a resume
        // continues from exactly this elapsed time.
        elapsedBaseRef.current = elapsedRef.current;
        countStartRef.current = null;
      }
      endAtRef.current = null;
      setTimerRunning(false);
    } else if (roundStartedRef.current) {
      resumeTimer();
    }
  };

  const resetTimer = () => {
    if (clockUnlimitedRef.current) {
      setElapsed(0);
      elapsedBaseRef.current = 0;
      if (timerRunning) countStartRef.current = Date.now();
      return;
    }
    setSecondsLeft(duration);
    setTimeUp(false);
    endAtRef.current = timerRunning ? Date.now() + duration * 1000 : null;
  };

  /* Duration chips (the prominent ⏱ section under the word card).
     Picking a chip never touches a live round's clock — beginRound
     locked the mode in; the pick shows up from the next round, which
     is what the caption under the chips says. Pre-round, the pending
     display follows the pick immediately so people see what they
     chose. */
  const pickDuration = (s: number) => {
    setUnlimited(false);
    setDuration(s);
    if (!roundStartedRef.current) {
      setSecondsLeft(s);
      setTimeUp(false);
    }
  };

  const pickUnlimited = () => {
    setUnlimited(true);
    if (!roundStartedRef.current) {
      setElapsed(0);
      setTimeUp(false);
    }
  };

  const stopClock = () => {
    setTimerRunning(false);
    endAtRef.current = null;
    countStartRef.current = null;
  };

  /* Back-button guard teardown: the round is over, so the sentinel
     comes off the stack (one silent step back over it — the popstate
     listener sees the guard is off and lets it pass) and back behaves
     normally again. Nobody stays trapped between rounds. */
  const endGuard = () => {
    guardLiveRef.current = false;
    guardArmedRef.current = false;
    setBackHint(false);
    if (guardArmTimerRef.current) {
      window.clearTimeout(guardArmTimerRef.current);
      guardArmTimerRef.current = null;
    }
    if (guardSentinelRef.current) {
      guardSentinelRef.current = false;
      window.history.back();
    }
  };

  useEffect(() => {
    const onPopState = () => {
      // Whatever sat on top of the stack is gone after any pop.
      guardSentinelRef.current = false;
      if (!guardLiveRef.current) return;
      if (document.fullscreenElement) {
        // Back in fullscreen just leaves fullscreen; the round and
        // the guard both stay right where they were.
        try {
          void document.exitFullscreen();
        } catch {
          // Already out — nothing to leave.
        }
        guardSentinelRef.current = true;
        window.history.pushState({ drawGuessGuard: true }, '');
        return;
      }
      if (!guardArmedRef.current) {
        // First back press mid-round: warn, re-arm the sentinel, and
        // open a short window in which a second press really leaves.
        guardArmedRef.current = true;
        setBackHint(true);
        guardSentinelRef.current = true;
        window.history.pushState({ drawGuessGuard: true }, '');
        guardArmTimerRef.current = window.setTimeout(() => {
          guardArmedRef.current = false;
          setBackHint(false);
        }, 2600);
        return;
      }
      // Second press inside the window: really leave. The sentinel is
      // already popped; one more step back exits the game page.
      guardLiveRef.current = false;
      guardArmedRef.current = false;
      setBackHint(false);
      window.history.back();
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  /* Fresh word + clean board + clock back to a full, not-yet-started
     round: Skip and Next round both mean "a new round", never "same
     board, new word" (user call 2026-10-21). The swap also confirms
     itself with eyes closed — buzz + chime + a big animated overlay
     that names NO word — because the drawer must never have to peek
     just to check the tap landed. An empty pool gets a clearly
     different buzz / tone / overlay instead. */
  const freshWord = () => {
    endGuard();
    stopClock();
    setTimeUp(false);
    setSecondsLeft(duration);
    setElapsed(0);
    elapsedBaseRef.current = 0;
    clockUnlimitedRef.current = unlimited;
    setClockUnlimited(unlimited);
    roundStartedRef.current = false;
    setRoundStarted(false);
    setRound((r) => r + 1); // clears the canvas via resetSignal
    setPhase('pass');
    setSidebarOpen(true);
    drawNewWord();
    const ok = pool.length > 0;
    if (swapFxTimerRef.current) {
      window.clearTimeout(swapFxTimerRef.current);
    }
    setSwapFx(ok ? 'ok' : 'empty');
    swapFxTimerRef.current = window.setTimeout(() => setSwapFx(null), 1400);
    swapChime(ok);
    try {
      navigator.vibrate?.(ok ? 60 : [90, 60, 90]);
    } catch {
      // Vibration is best-effort.
    }
  };

  const skipWord = () => freshWord();
  const nextRound = () => freshWord();

  const finishRound = (kind: ResultKind) => {
    if (phase !== 'draw') return;
    endGuard();
    stopClock();
    setResultKind(kind);
    if (kind === 'hit') {
      setTally((t) => t + 1);
      beep(3);
      try {
        navigator.vibrate?.(120);
      } catch {
        // vibration is best-effort
      }
    }
    setPhase('result');
    setSidebarOpen(true);
  };

  const revealAnswer = () => finishRound('reveal');

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
    const entry = makeCustomWord(managerTheme, text, newWordEn);
    setCustomWords((prev) =>
      prev.some((c) => c.id === entry.id) ? prev : [...prev, entry],
    );
    setNewWordText('');
    setNewWordEn('');
  };

  // Clear is two-tap (first tap arms it) — one stray kid tap must not
  // wipe a drawing the whole family is guessing at.
  useEffect(() => {
    if (!clearArmed) return;
    const t = window.setTimeout(() => setClearArmed(false), 2600);
    return () => window.clearTimeout(t);
  }, [clearArmed]);

  const onClearClick = () => {
    if (!clearArmed) {
      setClearArmed(true);
      return;
    }
    setClearArmed(false);
    canvasAction('clear');
  };

  const bigBtn =
    'flex min-h-[52px] items-center justify-center gap-2 rounded-2xl px-5 text-base font-semibold transition-colors';
  const chip =
    'flex min-h-[48px] items-center justify-center rounded-full px-4 text-sm font-medium transition-colors';
  const toolBtn =
    'flex h-12 min-w-0 flex-1 items-center justify-center gap-1 rounded-2xl px-2 text-sm font-semibold transition-colors';
  // In the landscape rail the same buttons stand upright in 3-up grid
  // cells: icon over a tiny label, 44px tall, never a bottom row.
  const railBtn =
    'landscape:h-11 landscape:flex-none landscape:flex-col landscape:gap-0 landscape:px-0 landscape:text-[10px]';
  const idleBtn =
    'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-100';
  const fmtClock = (total: number) =>
    `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
  // What the clock shows: a live round shows the mode it locked in;
  // between rounds it mirrors the chip selection for the next round.
  const showUnlimited = roundStarted ? clockUnlimited : unlimited;
  const timerText = timeUp
    ? '⏰ 0:00'
    : showUnlimited
      ? roundStarted
        ? `${timerRunning ? '⏱' : '⏸'} ${fmtClock(elapsed)}`
        : '∞ 不限时'
      : `${roundStarted && !timerRunning ? '⏸' : '⏱'} ${fmtClock(secondsLeft)}`;
  const handleClock = showUnlimited
    ? roundStarted
      ? fmtClock(elapsed)
      : '∞'
    : fmtClock(secondsLeft);
  const resultText =
    resultKind === 'hit'
      ? '🎉 猜对啦！Great guessing!'
      : resultKind === 'miss'
        ? '😅 没猜出来 — 就差一点！So close!'
        : '👀 答案揭晓 · The answer';

  return (
    <section
      aria-label="Draw and Guess game 你画我猜"
      className="fixed inset-0 z-[60] flex overflow-hidden bg-gradient-to-b from-sky-50 via-background to-background dark:from-sky-950/40 dark:via-background dark:to-background"
      style={{ overscrollBehavior: 'none' }}
    >
      <div
        className="mx-auto flex h-full w-full min-w-0 max-w-3xl flex-1 flex-col landscape:max-w-6xl landscape:flex-row"
        style={{
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)',
        }}
      >
        {/* Main column: slim top bar + the canvas. In landscape this is
            the left side; the toolbar rail takes the right. */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col px-2 pt-2 landscape:pb-2">
          {/* Top bar: fixed height in every state — exit + timer only.
              Landscape shrinks it to the bone; the canvas is the point. */}
          <div className="flex h-14 shrink-0 items-center gap-2 landscape:h-11">
            <Link
              href="/tools"
              aria-label="Back to Tools 返回工具"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-lg text-blue-900 transition-colors dark:bg-blue-950 dark:text-blue-100 landscape:h-10 landscape:w-10"
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
            {/* The ONE fullscreen control: always on the stage, in
                both states — a big amber entry when windowed, and a
                big amber EXIT while fullscreen (when the sidebar is
                usually closed and unreachable). Nothing else in the
                game may request fullscreen. */}
            <button
              type="button"
              data-testid="fullscreen-btn"
              onClick={() => void toggleFullscreen()}
              aria-pressed={isFullscreen}
              className="flex h-12 shrink-0 items-center justify-center gap-1.5 rounded-2xl bg-amber-400 px-3 text-sm font-bold text-slate-900 shadow transition-colors hover:bg-amber-300 landscape:h-10"
            >
              {isFullscreen ? '🚪 退出全屏' : '🖥 全屏'}
              <span className="hidden md:inline">
                {isFullscreen ? 'Exit' : 'Fullscreen'}
              </span>
            </button>
            <div
              data-testid="timer-display"
              className={`flex h-12 w-[104px] shrink-0 items-center justify-center rounded-2xl text-xl font-bold tabular-nums landscape:h-10 landscape:w-[92px] landscape:text-lg ${
                timeUp || (!showUnlimited && roundStarted && secondsLeft <= 10)
                  ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                  : 'bg-blue-600 text-white'
              }`}
            >
              {timerText}
            </div>
          </div>

          {/* Canvas fills every remaining pixel. The time-up banner and
              the verdict buttons are overlays inside this box, never in
              the document flow, so they can never resize the board. */}
          <div className="relative min-h-0 flex-1">
            <DrawCanvas
              color={color}
              brushFrac={brush.frac}
              erasing={erasing}
              enabled={phase === 'draw'}
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
            {phase === 'draw' && !timeUp && (
              <div className="absolute inset-x-3 bottom-3 z-10 flex gap-2.5">
                <button
                  type="button"
                  data-testid="act-miss-btn"
                  onClick={() => finishRound('miss')}
                  className="flex min-h-[56px] flex-1 items-center justify-center rounded-2xl border-2 border-blue-200 bg-white/95 px-3 text-lg font-bold text-blue-900 shadow-lg transition-colors dark:border-blue-800 dark:bg-slate-900/95 dark:text-blue-100"
                >
                  😅 没猜出来
                </button>
                <button
                  type="button"
                  data-testid="act-hit-btn"
                  onClick={() => finishRound('hit')}
                  className="flex min-h-[56px] flex-1 items-center justify-center rounded-2xl bg-emerald-600 px-3 text-lg font-bold text-white shadow-lg transition-colors hover:bg-emerald-500"
                >
                  🎉 猜对啦！
                </button>
              </div>
            )}
            {phase === 'draw' && timeUp && (
              <div className="absolute inset-x-3 bottom-3 z-10 flex">
                <button
                  type="button"
                  data-testid="timeup-reveal-btn"
                  onClick={revealAnswer}
                  className="flex min-h-[56px] flex-1 items-center justify-center rounded-2xl bg-blue-600 px-3 text-lg font-bold text-white shadow-lg transition-colors hover:bg-blue-500"
                >
                  👀 看答案 See the answer
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Toolbar — ONE node, two homes. Portrait: three rows under the
            canvas (unchanged). Landscape: a slim vertical rail on the
            right (3-up compact grids), so the canvas keeps the height
            the rows used to eat. */}
        <div
          data-testid="draw-toolbar"
          className="flex shrink-0 flex-col gap-2 px-2 pb-2 pt-2 landscape:w-[148px] landscape:gap-2.5 landscape:overflow-y-auto landscape:px-2.5 landscape:py-3"
        >
          <div
            className="flex h-14 items-center gap-1.5 landscape:grid landscape:h-auto landscape:grid-cols-3 landscape:gap-1.5"
            role="group"
            aria-label="Colors 颜色"
          >
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
                className={`h-12 min-w-0 flex-1 rounded-xl border-2 landscape:h-11 landscape:w-full landscape:flex-none ${
                  !erasing && color === c.hex
                    ? 'border-blue-600 ring-2 ring-blue-500 ring-offset-1 ring-offset-white dark:ring-offset-slate-900'
                    : 'border-black/10'
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
          <div className="flex h-14 items-center gap-2 landscape:grid landscape:h-auto landscape:grid-cols-3 landscape:gap-1.5">
            <button
              type="button"
              data-testid="eraser-btn"
              aria-pressed={erasing}
              onClick={() => setErasing(true)}
              className={`${toolBtn} ${railBtn} ${erasing ? 'bg-blue-600 text-white' : idleBtn}`}
            >
              <span aria-hidden="true">🩹</span>
              <span>橡皮</span>
            </button>
            <button
              type="button"
              data-testid="undo-btn"
              disabled={strokeCount === 0}
              onClick={() => canvasAction('undo')}
              className={`${toolBtn} ${railBtn} ${idleBtn} disabled:opacity-40`}
            >
              <span aria-hidden="true">↩️</span>
              <span>撤销</span>
            </button>
            <button
              type="button"
              data-testid="clear-btn"
              disabled={strokeCount === 0}
              onClick={onClearClick}
              className={`${toolBtn} ${railBtn} disabled:opacity-40 ${
                clearArmed ? 'bg-red-600 text-white' : idleBtn
              }`}
            >
              <span aria-hidden="true">🗑</span>
              <span>{clearArmed ? '确认?' : '清空'}</span>
            </button>
          </div>
          <div
            className="flex h-14 items-center gap-2 landscape:grid landscape:h-auto landscape:grid-cols-3 landscape:gap-1.5"
            role="group"
            aria-label="Brush size 笔粗"
          >
            {BRUSHES.map((b) => (
              <button
                key={b.id}
                type="button"
                aria-pressed={brush.id === b.id}
                onClick={() => setBrush(b)}
                className={`${toolBtn} ${railBtn} ${brush.id === b.id ? 'bg-blue-600 text-white' : idleBtn}`}
              >
                <span className="inline-block shrink-0 rounded-full bg-current landscape:scale-[0.6]" style={{ width: b.dot, height: b.dot }} />
                <span className="max-w-full truncate landscape:hidden">{b.label}</span>
                <span className="hidden max-w-full truncate landscape:inline">
                  {b.label.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─────────── Right sidebar: everything about the word ───────────
          An overlay in BOTH orientations now: it slides in over the
          stage (and over the landscape rail) and never changes the
          canvas geometry by a single pixel. */}
      {sidebarOpen && (
        <button
          type="button"
          data-testid="word-sidebar-scrim"
          aria-label="关闭侧边栏 Close panel"
          onClick={() => closeSidebar(false)}
          className="absolute inset-0 z-20 h-full w-full cursor-default bg-slate-900/30"
        />
      )}
      <aside
        id="word-sidebar"
        data-testid="word-sidebar"
        role="region"
        aria-label="词卡与设置 Word card and settings"
        aria-hidden={!sidebarOpen}
        className={`absolute inset-y-0 right-0 z-30 flex w-[320px] max-w-[88vw] flex-col bg-white shadow-2xl transition-transform duration-200 ease-out dark:bg-slate-900 ${
          sidebarOpen
            ? 'translate-x-0'
            : 'pointer-events-none translate-x-[105%]'
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

        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain px-4 pb-6 pt-4">
          {/* Word card + phase actions. The word is only ever rendered
              as text while it is meant to be seen (phase "show", a live
              hold-to-peek, or the result) — masked phases keep plaintext
              out of the DOM entirely. */}
          <section aria-label="Your word 你的词">
            {current ? (
              phase === 'result' ? (
                <div
                  data-testid="reveal-word"
                  className="rounded-3xl bg-blue-50 px-4 py-6 text-center dark:bg-blue-950/40"
                >
                  <p
                    data-testid="result-line"
                    className="text-base font-bold text-blue-900 dark:text-blue-100"
                  >
                    {resultText}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    答案是 · The word was
                  </p>
                  <span data-testid="word-text" className="mt-1 block text-4xl font-bold">
                    {shown}
                  </span>
                  <span data-testid="word-text-alt" className="mt-1 block text-base text-muted-foreground">
                    {lang === 'zh' ? current.en : current.zh}
                  </span>
                </div>
              ) : phase === 'show' ? (
                <div className="flex min-h-[150px] flex-col items-center justify-center rounded-3xl border-2 border-blue-300 bg-blue-50 px-4 text-center dark:border-blue-800 dark:bg-blue-950/40">
                  <span data-testid="word-text" className="text-4xl font-bold">
                    {shown}
                  </span>
                  <span data-testid="word-text-alt" className="mt-1 text-base text-muted-foreground">
                    {lang === 'zh' ? current.en : current.zh}
                  </span>
                  <span className="mt-3 text-sm text-muted-foreground">
                    记住它！点下面「遮住开画」就开始 · Memorize it, then
                    cover &amp; draw
                  </span>
                </div>
              ) : (
                <div
                  data-testid="sidebar-peek-area"
                  {...holdProps}
                  className="flex min-h-[150px] touch-none select-none flex-col items-center justify-center rounded-3xl border-2 border-dashed border-blue-300 bg-blue-50 px-4 text-center dark:border-blue-800 dark:bg-blue-950/40"
                >
                  {peeking ? (
                    <>
                      <span data-testid="word-text" className="text-4xl font-bold">
                        {shown}
                      </span>
                      <span
                        data-testid="word-text-alt"
                        className="mt-1 text-base text-muted-foreground"
                      >
                        {lang === 'zh' ? current.en : current.zh}
                      </span>
                    </>
                  ) : (
                    <>
                      <span data-testid="word-masked" className="text-3xl tracking-widest">
                        {masked}
                      </span>
                      <span className="mt-3 text-sm text-muted-foreground">
                        按住这里偷看 · Press &amp; hold to peek
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

            {current && phase === 'pass' && (
              <div className="mt-3 space-y-2">
                <p className="text-sm text-muted-foreground">
                  把手机递给画画的人，其他人先转过身 👀 Pass the phone to
                  the drawer — everyone else, no peeking!
                </p>
                <button
                  type="button"
                  data-testid="show-word-btn"
                  onClick={() => setPhase('show')}
                  className={`${bigBtn} w-full bg-blue-600 py-3 text-lg text-white hover:bg-blue-700`}
                >
                  👀 看词 See the word
                </button>
                <button
                  type="button"
                  data-testid="skip-word-btn"
                  onClick={skipWord}
                  className={`${bigBtn} w-full border-2 border-amber-300 bg-amber-50 py-3 text-lg text-amber-900 hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-100`}
                >
                  ⏭ 跳过 / 下一个词 Skip
                </button>
              </div>
            )}
            {current && phase === 'show' && (
              <div className="mt-3 space-y-2">
                <button
                  type="button"
                  data-testid="start-draw-btn"
                  onClick={startDraw}
                  className={`${bigBtn} w-full bg-blue-600 py-3 text-lg text-white hover:bg-blue-700`}
                >
                  ✏️ 记住了，遮住开画 Start drawing
                </button>
                <button
                  type="button"
                  data-testid="skip-word-btn"
                  onClick={skipWord}
                  className={`${bigBtn} w-full border-2 border-amber-300 bg-amber-50 py-3 text-lg text-amber-900 hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-100`}
                >
                  ⏭ 跳过 / 下一个词 Skip
                </button>
              </div>
            )}
            {current && phase === 'draw' && (
              <div className="mt-3 space-y-2">
                <button
                  type="button"
                  data-testid="start-draw-btn"
                  onClick={() => closeSidebar(true)}
                  className={`${bigBtn} w-full bg-blue-600 py-3 text-lg text-white hover:bg-blue-700`}
                >
                  ✏️ 继续画 Keep drawing
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
                <button
                  type="button"
                  data-testid="skip-word-btn"
                  onClick={skipWord}
                  className={`${bigBtn} w-full border-2 border-amber-300 bg-amber-50 py-3 text-lg text-amber-900 hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-100`}
                >
                  ⏭ 跳过 / 下一个词 Skip
                </button>
              </div>
            )}
            {current && phase === 'result' && (
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

          {/* 每轮时间 — promoted out of Settings to right under the
              word card: families could not find it buried down there
              ("找不到 = 没有"). Big chips, the current pick lit, and
              the semantics printed under the row: a pick never
              touches a live round — it applies from the next round. */}
          <section
            aria-label="Round time 每轮时间"
            data-testid="duration-selector"
            className="rounded-2xl bg-blue-50 px-4 py-3 dark:bg-blue-950/40"
          >
            <p className="text-sm font-semibold">⏱ 每轮时间 Round time</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {DURATIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  data-testid={`duration-btn-${s}`}
                  onClick={() => pickDuration(s)}
                  className={`${chip} ${!unlimited && duration === s ? 'bg-blue-600 text-white' : idleBtn}`}
                >
                  {s}秒
                </button>
              ))}
              <button
                type="button"
                data-testid="duration-btn-unlimited"
                onClick={pickUnlimited}
                className={`${chip} ${unlimited ? 'bg-blue-600 text-white' : idleBtn}`}
              >
                ∞ 不限时
              </button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              下一轮生效 · Applies from the next round — this round keeps
              its clock
            </p>
          </section>

          {/* Round + tally */}
          <section
            aria-label="Tally 记分"
            className="flex items-center gap-3 rounded-2xl bg-blue-50 px-4 py-3 text-sm dark:bg-blue-950/40"
          >
            <span>
              🎯 第 <strong>{round + 1}</strong> 轮 · ⭐ 记分 Tally:{' '}
              <strong data-testid="tally-count">{tally}</strong>
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
          </section>

          {/* Word bank manager (spoiler content — sidebar only) */}
          <section aria-label="Word bank 词库">
            <h2 className="text-lg font-bold">📚 词库 Word Bank</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              加自己的词、删不想画的词，都会存在这台手机上，下次打开还在。
              英文可填可不填，填了揭晓时会中英一起显示。 Custom words are
              saved on this phone and join the draw right away.
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

            <div className="mt-3 space-y-2">
              <div className="flex gap-2">
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
              <input
                value={newWordEn}
                onChange={(e) => setNewWordEn(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addCustomWord();
                }}
                placeholder="英文（可不填）English (optional)"
                aria-label="New word English 英文（可不填）"
                className="min-h-[48px] w-full rounded-2xl border border-blue-200 bg-background px-4 text-base dark:border-blue-900"
              />
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
                  {c.text}
                  {c.en ? (
                    <span className="text-muted-foreground">· {c.en}</span>
                  ) : null}{' '}
                  <span className="text-xs text-emerald-600">自加</span>
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

      {/* Sidebar handle: always on the right edge of the canvas (in
          landscape it parks at the rail's left edge), follows the panel,
          shows the running clock mid-round, and never carries the word. */}
      <button
        type="button"
        data-testid="word-sidebar-handle"
        aria-expanded={sidebarOpen}
        aria-controls="word-sidebar"
        aria-label="词卡与设置 Word and settings"
        onClick={() => (sidebarOpen ? closeSidebar(false) : setSidebarOpen(true))}
        style={sidebarOpen ? { right: 'min(320px, 88vw)' } : undefined}
        className="absolute right-0 top-[38%] z-30 flex min-h-[72px] w-8 flex-col items-center justify-center gap-1 rounded-l-2xl bg-blue-600 py-3 text-white shadow-lg transition-[right] duration-200 ease-out landscape:right-[148px]"
      >
        <span className="text-base leading-none">🔤</span>
        <span className="text-xs font-bold leading-none">词</span>
        <span className="text-[8px] font-medium leading-none">word</span>
        {roundStarted && !sidebarOpen && (
          <span className="text-[10px] font-bold tabular-nums leading-none">
            {timeUp ? '⏰' : handleClock}
          </span>
        )}
      </button>

      {/* Swap feedback: a big, brief, animated overlay that confirms
          the word changed WITHOUT naming any word (the sound + buzz
          in freshWord are its eyes-closed twins). Pure overlay — it
          never enters the layout flow or resizes anything. */}
      {swapFx && (
        <div
          data-testid="swap-feedback"
          aria-live="polite"
          className="pointer-events-none absolute inset-0 z-[80] flex items-center justify-center"
        >
          <div
            className={`animate-dg-pop flex flex-col items-center gap-1 rounded-3xl px-8 py-6 text-white shadow-2xl ${
              swapFx === 'ok' ? 'bg-emerald-600' : 'bg-amber-500'
            }`}
          >
            <span className="text-5xl leading-none">
              {swapFx === 'ok' ? '✓' : '⚠️'}
            </span>
            <span className="text-xl font-bold">
              {swapFx === 'ok' ? '已换新词' : '词库空了'}
            </span>
            <span className="text-sm opacity-90">
              {swapFx === 'ok'
                ? 'New word ready'
                : 'Add or restore words in the word bank'}
            </span>
          </div>
        </div>
      )}

      {/* Back-guard hint: the first mid-round back press landed here
          instead of leaving — say what happens on the second one. */}
      {backHint && (
        <p
          data-testid="back-guard-hint"
          className="pointer-events-none absolute left-1/2 top-16 z-[70] w-max max-w-[92%] -translate-x-1/2 rounded-2xl bg-slate-900/90 px-4 py-2 text-center text-sm font-semibold text-white shadow-lg"
        >
          ⚠️ 再按一次返回离开本局 · Press back again to leave this game
        </p>
      )}
    </section>
  );
}
