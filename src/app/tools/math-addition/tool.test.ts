/**
 * Behavioral regression tests for the Merge Racer addition game.
 *
 * These tests run the *shipped* tool code (MATH_TOOL_HTML + MATH_TOOL_JS from
 * tool-content.ts) inside jsdom and simulate real user interactions: picking
 * number cars, getting tips when stuck, switching fields, and generating the
 * printable worksheet. If the port ever breaks the game's wiring, these tests
 * catch it before merge.
 */
import { describe, expect, it } from 'vitest';
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
  const cars = (): HTMLElement[] =>
    Array.from(document.querySelectorAll('.number-car'));
  const click = (el: HTMLElement) =>
    el.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  const readRound = (): { target: number; values: number[] } => {
    const target = Number($('targetNumber').textContent);
    if (!Number.isFinite(target)) throw new Error('target is not a number');
    const values = cars().map((c) => Number(c.textContent));
    return { target, values };
  };
  /** Find two car indexes whose values do (or do not) add to the target. */
  const findPair = (target: number, values: number[], correct: boolean): [number, number] => {
    for (let i = 0; i < values.length; i += 1) {
      for (let j = i + 1; j < values.length; j += 1) {
        const sums = values[i] + values[j] === target;
        if (sums === correct) return [i, j];
      }
    }
    throw new Error(`no ${correct ? 'correct' : 'wrong'} pair found`);
  };
  const pickPair = (pair: [number, number]) => {
    click(cars()[pair[0]]);
    click(cars()[pair[1]]);
  };
  const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
  return { window, document, $, cars, click, readRound, findPair, pickPair, wait };
}

describe('merge racer game', () => {
  it('renders a target number and six number cars', () => {
    const { $, cars, readRound } = freshPage();
    const { target, values } = readRound();
    expect(target).toBeGreaterThan(0);
    expect(cars()).toHaveLength(6);
    expect(values.every((v) => Number.isFinite(v))).toBe(true);
    expect($('mergeBay')).toBeTruthy();
    expect($('tipBtn').textContent).toMatch(/tip/i);
  });

  it('pre-fills the merge bay result slot with the target number', () => {
    const { $, readRound } = freshPage();
    const { target } = readRound();
    // "? + ? = <target>": the goal is visible before any car is tapped.
    expect($('sumSlot').textContent).toBe(String(target));
    expect($('sumSlot').getAttribute('aria-label')).toContain(String(target));
  });

  it('accepts a correct pair, advances the race, and persists progress', () => {
    const { $, window, readRound, findPair, pickPair } = freshPage();
    const { target, values } = readRound();
    pickPair(findPair(target, values, true));
    expect($('feedbackText').textContent).toContain('Turbo merge!');
    expect($('streakStat').textContent).toBe('1');
    expect($('lapStat').textContent).toBe('2');
    // Regression guard: progress must go to localStorage (not memory) on the site.
    const saved = JSON.parse(
      window.localStorage.getItem('kids-math-addition-progress') ?? 'null',
    );
    expect(saved).not.toBeNull();
    expect(saved.correct).toBe(1);
    expect(saved.streak).toBe(1);
  });

  it('rejects a wrong pair with try-again feedback and resets the streak', () => {
    const { $, readRound, findPair, pickPair } = freshPage();
    const { target, values } = readRound();
    pickPair(findPair(target, values, false));
    expect($('feedback').className).toContain('error');
    expect($('feedbackText').textContent).toContain('Close');
    expect($('streakStat').textContent).toBe('0');
  });

  it('shows a racing tip on demand', () => {
    const { $, click } = freshPage();
    click($('tipBtn'));
    expect($('feedback').className).toContain('tip');
    expect($('feedbackText').textContent).toContain('Pit-stop tip');
  });

  it('auto-shows a tip after two wrong picks (stuck player)', async () => {
    const { $, readRound, findPair, pickPair, wait } = freshPage();
    const { target, values } = readRound();
    pickPair(findPair(target, values, false));
    await wait(750); // wrong-pair shake + unlock
    pickPair(findPair(target, values, false));
    await wait(750);
    expect($('feedback').className).toContain('tip');
    expect($('feedbackText').textContent).toContain('Pit-stop tip');
  });

  it('switches between the Basic (to 20) and Advanced (to 100) fields', () => {
    const { $, document, click, readRound } = freshPage();
    const advanced = Array.from(document.querySelectorAll('.mode-btn')).find(
      (b) => b.getAttribute('data-mode') === 'advanced',
    ) as HTMLElement;
    click(advanced);
    const high = readRound().target;
    expect(high).toBeGreaterThanOrEqual(32);
    expect(high).toBeLessThanOrEqual(96);
    const basic = Array.from(document.querySelectorAll('.mode-btn')).find(
      (b) => b.getAttribute('data-mode') === 'basic',
    ) as HTMLElement;
    click(basic);
    const low = readRound().target;
    expect(low).toBeGreaterThanOrEqual(7);
    expect(low).toBeLessThanOrEqual(20);
    expect($('streakStat').textContent).toBe('0');
  });
});

describe('printable worksheet', () => {
  it('generates a printable worksheet grid', () => {
    const { $, click } = freshPage();
    ($('count-select') as HTMLSelectElement).value = '10';
    click($('generate-btn'));
    expect($('worksheet-grid').children.length).toBeGreaterThanOrEqual(10);
    expect($('worksheet-grid').textContent).toContain('+');
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

  it('stacks worksheet controls in one column on phones (mobile overflow fix)', () => {
    // Regression: the two-column control grid overflowed the card on ~390px phones.
    expect(MATH_TOOL_CSS).toMatch(
      /@media\s*\(\s*max-width:\s*560px\s*\)[\s\S]*?\.math-tool \.controls\{\s*grid-template-columns:\s*1fr;/,
    );
  });
});
