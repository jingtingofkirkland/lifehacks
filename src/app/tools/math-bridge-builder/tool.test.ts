/**
 * Behavioral regression tests for the Bridge Builder word-problem game.
 *
 * These tests run the *shipped* tool code (MATH_TOOL_HTML + MATH_TOOL_JS from
 * tool-content.ts) inside jsdom and simulate real user interactions: solving
 * story problems to lay planks, getting drawing tips on wrong answers,
 * switching difficulty, completing a bridge, and generating the printable
 * worksheet. If the port ever breaks the game's wiring, these tests catch it
 * before merge.
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
  const answer = (): number => {
    const raw = $('problemText').getAttribute('data-answer');
    const n = Number(raw);
    if (!Number.isInteger(n)) throw new Error(`bad data-answer: ${raw}`);
    return n;
  };
  const filledPlanks = (): number =>
    document.querySelectorAll('#plankRow .plank-slot.filled').length;
  const solveCurrent = (correct: boolean) => {
    const a = answer();
    ($('answerInput') as HTMLInputElement).value = String(correct ? a : a + 1);
    click($('submitBtn'));
  };

  return { window, document, $, click, answer, filledPlanks, solveCurrent };
}

describe('bridge builder scene', () => {
  it('renders six plank slots, animals, the problem, and the keypad', () => {
    const { document, $ } = freshPage();
    expect(document.querySelectorAll('#plankRow .plank-slot')).toHaveLength(6);
    expect(document.querySelectorAll('#plankRow .plank-slot .animal')).toHaveLength(6);
    expect($('problemText').textContent).toMatch(/\?|How many/);
    expect($('problemText').getAttribute('data-answer')).toMatch(/^\d+$/);
    expect($('speakBtn')).toBeTruthy();
    expect(document.querySelectorAll('#keypad .key-btn')).toHaveLength(12);
    expect($('bridgeStat').textContent).toBe('0/6');
  });

  it('a correct answer lays a plank and updates the score', () => {
    const { $, filledPlanks, solveCurrent } = freshPage();
    solveCurrent(true);
    expect(filledPlanks()).toBe(1);
    expect($('scoreStat').textContent).toBe('1');
    expect($('streakStat').textContent).toBe('1');
    expect($('bridgeStat').textContent).toBe('1/6');
    expect($('feedbackText').textContent).toMatch(/plank|bridge|animal/i);
  });

  it('a wrong answer wobbles a plank and shows the drawing tip', () => {
    const { document, $, filledPlanks, solveCurrent } = freshPage();
    solveCurrent(false);
    expect(filledPlanks()).toBe(0);
    expect($('feedbackText').textContent).toMatch(/wobble/i);
    // The loose plank wobbles on the next empty slot.
    expect(document.querySelectorAll('#plankRow .plank-slot.wobbling')).toHaveLength(1);
    // The drawing tip appears on the wooden pier sign.
    expect($('pierBoard').classList.contains('visible')).toBe(true);
    expect($('tipDrawing').querySelector('svg')).toBeTruthy();
    expect($('streakStat').textContent).toBe('0');
  });

  it('six correct answers complete the bridge with a celebration', () => {
    const { $, solveCurrent } = freshPage();
    for (let i = 0; i < 6; i += 1) solveCurrent(true);
    expect($('celebration').classList.contains('show')).toBe(true);
    expect($('celebText').textContent).toMatch(/animals are home/i);
    expect($('bridgeStat').textContent).toBe('6/6');
    // Confetti pieces are spawned.
    expect($('scene').querySelectorAll('.confetti').length).toBeGreaterThan(0);
    // Starting a new bridge resets the planks.
    $('newBridgeBtn').dispatchEvent(
      new ($('newBridgeBtn').ownerDocument.defaultView as typeof window).MouseEvent('click', { bubbles: true }),
    );
    expect($('celebration').classList.contains('show')).toBe(false);
    expect($('bridgeStat').textContent).toBe('0/6');
  });

  it('the hint button shows the drawing tip without penalty', () => {
    const { $, click, filledPlanks } = freshPage();
    click($('tipBtn'));
    expect($('pierBoard').classList.contains('visible')).toBe(true);
    expect($('tipDrawing').querySelector('svg')).toBeTruthy();
    expect(filledPlanks()).toBe(0);
  });

  it('the speaker button does not throw when speech synthesis is missing', () => {
    const { $, click } = freshPage();
    expect(() => click($('speakBtn'))).not.toThrow();
  });

  it('the keypad types digits into the answer box', () => {
    const { document, $, click } = freshPage();
    const input = $('answerInput') as HTMLInputElement;
    const key = (k: string) =>
      (Array.from(document.querySelectorAll('#keypad .key-btn')) as HTMLElement[]).find(
        (b) => b.getAttribute('data-key') === k,
      )!;
    click(key('4'));
    click(key('2'));
    expect(input.value).toBe('42');
    click(key('clear'));
    expect(input.value).toBe('4');
  });

  it('switching to advanced mode regenerates the problem', () => {
    const { document, $, click } = freshPage();
    const before = $('problemText').textContent;
    const adv = (Array.from(document.querySelectorAll('.mode-btn')) as HTMLElement[]).find(
      (b) => b.getAttribute('data-mode') === 'advanced',
    )!;
    click(adv);
    expect(adv.getAttribute('aria-pressed')).toBe('true');
    // A fresh bridge starts on the new mode.
    expect($('bridgeStat').textContent).toBe('0/6');
    expect($('problemText').getAttribute('data-answer')).toMatch(/^\d+$/);
    // Sanity: the problem text is a story (mentions a quantity word), not a bare equation.
    expect($('problemText').textContent).not.toMatch(/^\s*\d+\s*[+\-]\s*\d+\s*=\s*\?\s*$/);
    expect(before).toBeTruthy();
  });

  it('progress persists to localStorage', () => {
    const { window, solveCurrent } = freshPage();
    solveCurrent(true);
    const raw = window.localStorage.getItem('kids-math-bridge-builder-progress');
    expect(raw).toBeTruthy();
    const saved = JSON.parse(raw!);
    expect(saved.score).toBe(1);
    expect(saved.best).toBe(1);
  });
});

describe('bridge builder worksheet', () => {
  it('generates story problems and keeps the mobile name line flexible', () => {
    const { document, $, click } = freshPage();
    click($('generate-btn'));
    const problems = document.querySelectorAll('#worksheet-grid .sheet-problem');
    expect(problems.length).toBe(10);
    // Story problems, not bare equations.
    expect(problems[0].textContent).toMatch(/How many/);
    // Regression: the Name line must stay flexible on mobile (PR #3 fix).
    expect(document.querySelector('.name-line')).toBeTruthy();
    expect(document.querySelector('.name-line .name-blank')).toBeTruthy();
  });

  it('the answer key toggle reveals answers', () => {
    const { document, $, click } = freshPage();
    click($('generate-btn'));
    const sheet = $('sheet');
    expect(sheet.classList.contains('show-answers')).toBe(false);
    ($('answer-key-toggle') as HTMLInputElement).checked = true;
    $('answer-key-toggle').dispatchEvent(
      new ($('answer-key-toggle').ownerDocument.defaultView as typeof window).Event('change', { bubbles: true }),
    );
    expect(sheet.classList.contains('show-answers')).toBe(true);
    const firstAnswer = document.querySelector('#worksheet-grid .sheet-answer');
    expect(firstAnswer?.textContent).toMatch(/^\d+$/);
  });

  it('the shipped CSS is scoped and carries the PR #3 name-line rule', () => {
    expect(MATH_TOOL_CSS).toContain('.math-tool');
    expect(MATH_TOOL_CSS).toContain('.name-blank');
    // No global leaks: the shipped CSS must not style bare body/html.
    expect(MATH_TOOL_CSS).not.toMatch(/(^|\n)\s*body\s*\{/);
  });

  it('stacks worksheet controls vertically on phones (mobile overflow fix)', () => {
    // Regression guard: on ~390px phones the controls must stack instead of
    // squeezing side by side and overflowing the worksheet card.
    expect(MATH_TOOL_CSS).toMatch(
      /@media\s*\(\s*max-width:\s*560px\s*\)[\s\S]*?\.math-tool \.generator \.controls\{\s*flex-direction:\s*column;/,
    );
    // The sheet header (title + Name/Date/Score line) must also stack on phones.
    expect(MATH_TOOL_CSS).toMatch(
      /@media\s*\(\s*max-width:\s*560px\s*\)[\s\S]*?\.math-tool \.sheet-head\{\s*display:\s*block;/,
    );
  });
});
