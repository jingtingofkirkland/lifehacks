/**
 * Behavioral regression tests for the Bubble Pop missing-number game.
 *
 * These tests run the *shipped* tool code (MATH_TOOL_HTML + MATH_TOOL_JS from
 * tool-content.ts) inside jsdom and simulate real user interactions: popping
 * bubbles, getting ten-frame tips when stuck, switching difficulty, and
 * generating the printable worksheet. If the port ever breaks the game's
 * wiring, these tests catch it before merge.
 */
import { describe, expect, it, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import { MATH_TOOL_CSS, MATH_TOOL_HTML, MATH_TOOL_JS } from './tool-content';

function freshPage() {
  const dom = new JSDOM(`<!DOCTYPE html><html><body>${MATH_TOOL_HTML}</body></html>`, {
    url: 'https://example.org/',
    runScripts: 'outside-only',
  });
  const { window } = dom;
  // The tool script is an IIFE that mounts itself onto the document.
  window.eval(MATH_TOOL_JS);
  const document = window.document;

  const $ = (id: string): HTMLElement => {
    const el = document.getElementById(id);
    if (!el) throw new Error(`expected element #${id} to exist`);
    return el;
  };
  const bubbles = (): HTMLElement[] =>
    Array.from(document.querySelectorAll('.bubble'));
  const click = (el: HTMLElement) =>
    el.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  /** Parse the center equation and solve for the missing number. */
  const readRound = (): { answer: number; values: number[] } => {
    const text = ($('equation').textContent ?? '').replace(/\s+/g, '');
    const m = text.match(/^(\d+|\?)([+-])(\d+|\?)=(\d+|\?)$/);
    if (!m) throw new Error(`cannot parse equation: ${text}`);
    const num = (s: string): number | null => (s === '?' ? null : Number(s));
    const t1 = num(m[1]);
    const op = m[2];
    const t3 = num(m[3]);
    const t5 = num(m[4]);
    let answer: number;
    if (t1 === null) {
      if (t3 === null || t5 === null) throw new Error('two unknowns');
      answer = op === '+' ? t5 - t3 : t5 + t3;
    } else {
      if (t3 === null) {
        if (t5 === null) throw new Error('two unknowns');
        answer = op === '+' ? t5 - t1 : t1 - t5;
      } else {
        throw new Error('no unknown in equation');
      }
    }
    if (!Number.isFinite(answer)) throw new Error('answer is not a number');
    const values = bubbles().map((b) => Number(b.getAttribute('data-value')));
    return { answer, values };
  };
  const answerBubble = (): HTMLElement => {
    const { answer } = readRound();
    const found = bubbles().find(
      (b) => Number(b.getAttribute('data-value')) === answer,
    );
    if (!found) throw new Error(`no bubble holds the answer ${answer}`);
    return found;
  };
  const wrongBubble = (exclude?: HTMLElement): HTMLElement => {
    const { answer } = readRound();
    const found = bubbles().find(
      (b) =>
        Number(b.getAttribute('data-value')) !== answer && b !== exclude,
    );
    if (!found) throw new Error('no wrong bubble found');
    return found;
  };
  const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
  return { window, document, $, bubbles, click, readRound, answerBubble, wrongBubble, wait };
}

describe('bubble pop game', () => {
  it('renders an equation with a missing piece and five bubbles', () => {
    const { $, bubbles, readRound } = freshPage();
    const { answer, values } = readRound();
    expect($('equation').textContent).toContain('?');
    expect(bubbles()).toHaveLength(5);
    expect(values).toContain(answer);
    expect(new Set(values).size).toBe(values.length); // no duplicate bubbles
    expect($('tipBtn').textContent).toMatch(/tip/i);
  });

  it('pops the correct bubble: score, streak, and persisted progress', () => {
    const { $, window, click, answerBubble } = freshPage();
    click(answerBubble());
    expect($('feedback').className).toContain('good');
    expect($('feedbackText').textContent).toContain('Pop!');
    expect($('scoreStat').textContent).toBe('1');
    expect($('streakStat').textContent).toBe('1');
    // Regression guard: progress must go to localStorage (not memory) on the site.
    const saved = JSON.parse(
      window.localStorage.getItem('kids-math-bubble-pop-progress') ?? 'null',
    );
    expect(saved).not.toBeNull();
    expect(saved.correct).toBe(1);
    expect(saved.streak).toBe(1);
  });

  it('a wrong tap wobbles the bubble and resets the streak without punishment', () => {
    const { $, click, wrongBubble } = freshPage();
    const bad = wrongBubble();
    click(bad);
    expect(bad.className).toContain('wobble');
    expect($('feedback').className).toContain('error');
    expect($('feedbackText').textContent).toContain('try again');
    expect($('streakStat').textContent).toBe('0');
    expect($('scoreStat').textContent).toBe('0'); // no punishment
  });

  it('shows a ten-frame tip on demand and highlights the answer bubble', async () => {
    const { $, document, click, answerBubble, wait } = freshPage();
    click($('tipBtn'));
    await wait(120); // the tip card fades in on a short timer
    expect($('feedback').className).toContain('tip');
    expect($('feedbackText').textContent).toContain('Bubble hint');
    const target = answerBubble();
    expect(target.className).toContain('hint-glow');
    const card = target.querySelector('.bubble-tip.visible');
    expect(card).not.toBeNull();
    // The visual aid is a ten-frame with filled dots.
    expect(card!.querySelectorAll('.tf .dot.on').length).toBeGreaterThan(0);
  });

  it('auto-shows a tip after two wrong taps (stuck player)', async () => {
    const { $, click, wrongBubble, wait } = freshPage();
    const first = wrongBubble();
    click(first);
    click(wrongBubble(first));
    await wait(150);
    expect($('feedback').className).toContain('tip');
    expect($('feedbackText').textContent).toContain('Bubble hint');
  });

  it('switches between Basic (5 bubbles) and Advanced (6 bubbles)', () => {
    const { $, document, bubbles, click } = freshPage();
    const advanced = Array.from(document.querySelectorAll('.mode-btn')).find(
      (b) => b.getAttribute('data-mode') === 'advanced',
    ) as HTMLElement;
    click(advanced);
    expect(bubbles()).toHaveLength(6);
    expect($('streakStat').textContent).toBe('0');
    const basic = Array.from(document.querySelectorAll('.mode-btn')).find(
      (b) => b.getAttribute('data-mode') === 'basic',
    ) as HTMLElement;
    click(basic);
    expect(bubbles()).toHaveLength(5);
  });
});

describe('printable worksheet', () => {
  it('generates missing-number problems', () => {
    const { $, click } = freshPage();
    ($('count-select') as HTMLSelectElement).value = '10';
    click($('generate-btn'));
    expect($('worksheet-grid').children.length).toBeGreaterThanOrEqual(10);
    expect($('worksheet-grid').textContent).toContain('____');
  });

  it('toggles the answer key class on the worksheet', () => {
    const { $, window, click } = freshPage();
    const toggle = $('answers-toggle') as HTMLInputElement;
    toggle.checked = true;
    toggle.dispatchEvent(new window.Event('change', { bubbles: true }));
    expect($('sheet').classList.contains('show-answers')).toBe(true);
    toggle.checked = false;
    toggle.dispatchEvent(new window.Event('change', { bubbles: true }));
    expect($('sheet').classList.contains('show-answers')).toBe(false);
  });

  it('keeps the mobile name-line fix (flexible blank, no fixed underscores)', () => {
    // PR #3 regression: the Name row must shrink instead of overflowing.
    expect(MATH_TOOL_HTML).toContain('class="name-blank"');
    expect(MATH_TOOL_HTML).not.toMatch(/Name:\s*_{5,}/);
  });
});

describe('generated tool content (generator regression guards)', () => {
  it('uses the localStorage progress store on the published site', () => {
    expect(MATH_TOOL_JS).toContain('new LocalStorageProgressStore()');
    expect(MATH_TOOL_JS).toContain(
      'const progressStore = new LocalStorageProgressStore();',
    );
    expect(MATH_TOOL_JS).toContain('kids-math-bubble-pop-progress');
  });

  it('keeps all tool CSS scoped under .math-tool', () => {
    const unscoped = MATH_TOOL_CSS.split('\n').filter((line) =>
      /^\s*(body|\*|h1|h2|h3|p|button|input|select|label)\s*\{/.test(line),
    );
    expect(unscoped).toEqual([]);
    expect(MATH_TOOL_CSS).toContain('.math-tool');
  });

  it('follows the site theme (shadcn tokens, .dark class, no webfont imports)', () => {
    expect(MATH_TOOL_CSS).toContain('hsl(var(--background))');
    expect(MATH_TOOL_CSS).toContain('.dark .math-tool');
    expect(MATH_TOOL_CSS).not.toContain('fonts.googleapis.com');
    expect(MATH_TOOL_CSS).not.toContain('prefers-color-scheme');
  });

  it('has no separate Learn section (learn-through-practice only)', () => {
    expect(MATH_TOOL_HTML).not.toContain('id="learn"');
    expect(MATH_TOOL_HTML).not.toMatch(/>\s*Learn\s*</);
  });

  it('stacks worksheet controls vertically on phones (mobile overflow fix)', () => {
    // Regression guard: on ~390px phones the controls must stack instead of
    // squeezing side by side and overflowing the worksheet card.
    expect(MATH_TOOL_CSS).toMatch(
      /@media\s*\(\s*max-width:\s*560px\s*\)[\s\S]*?\.math-tool \.generator \.controls\{\s*flex-direction:\s*column;/,
    );
    // The sheet header (title + Name line) must also stack on phones.
    expect(MATH_TOOL_CSS).toMatch(
      /@media\s*\(\s*max-width:\s*560px\s*\)[\s\S]*?\.math-tool \.sheet-head\{\s*display:\s*block;/,
    );
  });
});

describe('meta pixel events', () => {
  it('fires GameStarted once on first tap and WorksheetPrinted on generate', () => {
    const { window, click, answerBubble, wrongBubble, $ } = freshPage();
    const fbq = vi.fn();
    (window as unknown as { fbq: unknown }).fbq = fbq;
    click(answerBubble());
    click(wrongBubble());
    const started = fbq.mock.calls.filter((c) => c[1] === 'GameStarted');
    expect(started).toHaveLength(1);
    expect(started[0]).toEqual([
      'trackCustom',
      'GameStarted',
      { game: 'bubble_pop' },
    ]);
    click($('generate-btn'));
    expect(fbq).toHaveBeenCalledWith('trackCustom', 'WorksheetPrinted', {
      game: 'bubble_pop',
    });
  });

  it('does not fire pixel events when fbq is missing (ad blocker)', () => {
    const { click, answerBubble, $ } = freshPage();
    expect(() => {
      click(answerBubble());
      click($('generate-btn'));
    }).not.toThrow();
  });
});
