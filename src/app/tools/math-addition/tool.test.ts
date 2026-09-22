/**
 * Behavioral regression tests for the Kids Math addition tool.
 *
 * These tests run the *shipped* tool code (MATH_TOOL_HTML + MATH_TOOL_JS from
 * tool-content.ts) inside jsdom and simulate real user interactions: tab
 * switching, answering problems, hints, solutions, and worksheet generation.
 * If the generator (build-tool-content.py) ever breaks the tool's wiring,
 * these tests catch it before merge.
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
  const click = (el: HTMLElement) =>
    el.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  const submitAnswer = (value: string) => {
    ( $('answer') as HTMLInputElement ).value = value;
    $('answer-form').dispatchEvent(
      new window.Event('submit', { bubbles: true, cancelable: true }),
    );
  };
  const readProblem = (): { a: number; b: number } => {
    const text = $('problem').textContent ?? '';
    const m = text.match(/(\d+)\s*\+\s*(\d+)/);
    if (!m) throw new Error(`unexpected problem text: "${text}"`);
    return { a: Number(m[1]), b: Number(m[2]) };
  };
  return { window, document, $, click, submitAnswer, readProblem };
}

describe('math addition tool', () => {
  it('switches between Learn / Practice / Worksheet tabs', () => {
    const { $, click } = freshPage();
    click($('tab-worksheet'));
    expect($('tab-worksheet').getAttribute('aria-selected')).toBe('true');
    expect($('worksheet').classList.contains('active')).toBe(true);
    expect($('practice').classList.contains('active')).toBe(false);
    click($('tab-practice'));
    expect($('practice').classList.contains('active')).toBe(true);
  });

  it('accepts a correct answer, updates stats, and persists progress', () => {
    const { $, window, submitAnswer, readProblem } = freshPage();
    const { a, b } = readProblem();
    submitAnswer(String(a + b));
    expect($('feedback').className).toContain('good');
    expect($('correct-stat').textContent).toBe('1');
    expect($('streak-stat').textContent).toBe('1');
    expect(($('next-btn') as HTMLButtonElement).hidden).toBe(false);
    // Regression guard: progress must go to localStorage (not memory) on the site.
    const saved = JSON.parse(
      window.localStorage.getItem('kids-math-addition-progress') ?? 'null',
    );
    expect(saved).not.toBeNull();
    expect(saved.correct).toBe(1);
    expect(saved.streak).toBe(1);
  });

  it('rejects a wrong answer with try-again feedback and resets the streak', () => {
    const { $, submitAnswer, readProblem } = freshPage();
    const { a, b } = readProblem();
    submitAnswer(String(a + b + 1));
    expect($('feedback').className).toContain('try');
    expect($('correct-stat').textContent).toBe('0');
  });

  it('asks for a whole number on empty input', () => {
    const { $, submitAnswer } = freshPage();
    submitAnswer('');
    expect($('feedback').textContent).toContain('whole number');
  });

  it('reveals a hint without marking the question answered', () => {
    const { $, click } = freshPage();
    click($('hint-btn'));
    expect($('feedback').className).toContain('info');
    expect(($('feedback').textContent ?? '').length).toBeGreaterThan(20);
    expect(($('answer') as HTMLInputElement).disabled).toBe(false);
  });

  it('reveals the worked solution and locks the answer box', () => {
    const { $, click } = freshPage();
    click($('solution-btn'));
    expect($('feedback').textContent).toContain('Worked solution');
    expect(($('answer') as HTMLInputElement).disabled).toBe(true);
  });

  it('loads a fresh problem after clicking next', () => {
    const { $, click, submitAnswer, readProblem } = freshPage();
    const { a, b } = readProblem();
    submitAnswer(String(a + b));
    click($('next-btn'));
    expect(($('answer') as HTMLInputElement).disabled).toBe(false);
    expect(($('answer') as HTMLInputElement).value).toBe('');
    expect($('problem').textContent).toMatch(/(\d+)\s*\+\s*(\d+)/);
  });

  it('generates a printable worksheet grid', () => {
    const { $, click } = freshPage();
    click($('tab-worksheet'));
    ($('count-select') as HTMLSelectElement).value = '10';
    click($('generate-btn'));
    expect($('worksheet-grid').children.length).toBeGreaterThanOrEqual(10);
    expect($('worksheet-grid').textContent).toContain('+');
  });

  it('toggles the answer key class on the worksheet', () => {
    const { $, window, click } = freshPage();
    click($('tab-worksheet'));
    const toggle = $('answers-toggle') as HTMLInputElement;
    toggle.checked = true;
    toggle.dispatchEvent(new window.Event('change', { bubbles: true }));
    expect($('sheet').classList.contains('show-answers')).toBe(true);
    toggle.checked = false;
    toggle.dispatchEvent(new window.Event('change', { bubbles: true }));
    expect($('sheet').classList.contains('show-answers')).toBe(false);
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

  it('ships the three expected panels', () => {
    expect(MATH_TOOL_HTML).toContain('id="learn"');
    expect(MATH_TOOL_HTML).toContain('id="practice"');
    expect(MATH_TOOL_HTML).toContain('id="worksheet"');
  });
});
