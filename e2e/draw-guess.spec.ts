import { test, expect, type Page } from '@playwright/test';

type Box = { x: number; y: number; width: number; height: number };

async function canvasBox(page: Page): Promise<Box> {
  const box = await page.getByTestId('draw-canvas').boundingBox();
  if (!box) throw new Error('canvas has no bounding box');
  return box;
}

function expectSameBox(a: Box, b: Box) {
  for (const k of ['x', 'y', 'width', 'height'] as const) {
    expect(Math.abs(a[k] - b[k]), `canvas ${k} moved`).toBeLessThanOrEqual(1);
  }
}

/** Count pixels that have anything painted on them (alpha > 0). */
async function paintedPixels(page: Page): Promise<number> {
  return page.getByTestId('draw-canvas').evaluate((canvas) => {
    const el = canvas as HTMLCanvasElement;
    const ctx = el.getContext('2d');
    if (!ctx || el.width === 0 || el.height === 0) return -1;
    const data = ctx.getImageData(0, 0, el.width, el.height).data;
    let n = 0;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] > 0) n += 1;
    }
    return n;
  });
}

/** Is there a dark (default brush color) pixel near a canvas fraction? */
async function darkPixelNear(
  page: Page,
  fx: number,
  fy: number,
): Promise<boolean> {
  return page
    .getByTestId('draw-canvas')
    .evaluate((canvas, arg: { fx: number; fy: number }) => {
      const el = canvas as HTMLCanvasElement;
      const ctx = el.getContext('2d');
      if (!ctx || el.width === 0 || el.height === 0) return false;
      const cx = Math.floor(arg.fx * el.width);
      const cy = Math.floor(arg.fy * el.height);
      const r = 6;
      const x0 = Math.max(0, cx - r);
      const y0 = Math.max(0, cy - r);
      const w = Math.min(el.width - x0, r * 2 + 1);
      const h = Math.min(el.height - y0, r * 2 + 1);
      const data = ctx.getImageData(x0, y0, w, h).data;
      for (let i = 0; i < data.length; i += 4) {
        if (
          data[i + 3] > 200 &&
          data[i] < 90 &&
          data[i + 1] < 90 &&
          data[i + 2] < 90
        ) {
          return true;
        }
      }
      return false;
    }, { fx, fy });
}

/** Drag a stroke between two canvas-fraction points. */
async function dragStroke(
  page: Page,
  from: { fx: number; fy: number },
  to: { fx: number; fy: number },
) {
  const box = await canvasBox(page);
  await page.mouse.move(box.x + box.width * from.fx, box.y + box.height * from.fy);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * to.fx, box.y + box.height * to.fy, {
    steps: 10,
  });
  await page.mouse.up();
}

/** Hold the sidebar peek area and read the word; always releases. */
async function holdToReadWord(page: Page): Promise<string> {
  const peek = page.getByTestId('sidebar-peek-area');
  const box = await peek.boundingBox();
  if (!box) throw new Error('peek area has no bounding box');
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await expect(page.getByTestId('word-text')).toBeVisible();
  const text = await page.getByTestId('word-text').textContent();
  await page.mouse.up();
  await expect(page.getByTestId('word-text')).toHaveCount(0);
  return (text ?? '').trim();
}

/**
 * The two-step start the local playtest version uses: 看词 (the word
 * shows bilingually — main line + the other language under it) then
 * 记住了，遮住开画. Asserts the bilingual pair in the show phase.
 */
async function lookThenStartDrawing(
  page: Page,
  expectedWord?: string,
): Promise<void> {
  await page.getByTestId('show-word-btn').click();
  await expect(page.getByTestId('word-text')).toBeVisible();
  if (expectedWord) {
    await expect(page.getByTestId('word-text')).toHaveText(expectedWord);
  }
  // Bilingual, always: whichever language is primary, the other one is
  // on screen at the same time — never a language toggle that hides it.
  const alt = page.getByTestId('word-text-alt');
  await expect(alt).toBeVisible();
  expect((await alt.textContent())?.trim().length).toBeGreaterThan(0);
  await page.getByTestId('start-draw-btn').click();
  await expectSidebarOffscreen(page);
}

async function expectSidebarOffscreen(page: Page) {
  const sidebar = page.getByTestId('word-sidebar');
  const viewport = page.viewportSize();
  if (!viewport) throw new Error('no viewport');
  await expect
    .poll(
      async () => {
        const b = await sidebar.boundingBox();
        return b ? b.x : -1;
      },
      { timeout: 3000 },
    )
    .toBeGreaterThanOrEqual(viewport.width - 1);
}

test('draw & guess: sidebar-first round — peek, skip, draw, reveal, next', async ({
  page,
}) => {
  // Portrait viewport: the sidebar is an overlay here (landscape gets
  // the side-workbench treatment in its own test below).
  await page.setViewportSize({ width: 900, height: 1280 });
  await page.goto('/tools/draw-guess/');

  await expect(
    page.getByRole('heading', { name: /draw & guess/i }),
  ).toBeVisible();

  // Sidebar starts open with a masked word; the word is never static text.
  const sidebar = page.getByTestId('word-sidebar');
  const sideBox = await sidebar.boundingBox();
  if (!sideBox) throw new Error('sidebar has no bounding box');
  expect(sideBox.x).toBeGreaterThanOrEqual(0);
  await expect(page.getByTestId('word-masked')).toBeVisible();
  await expect(page.getByTestId('word-masked')).toContainText('•');
  await expect(page.getByTestId('word-text')).toHaveCount(0);

  // The canvas is already full-size behind the sidebar.
  const canvasBefore = await canvasBox(page);

  // Hold to peek — bilingually: while holding, the other language is
  // right there under the main word; release re-masks immediately.
  const peekArea = page.getByTestId('sidebar-peek-area');
  const peekBox = await peekArea.boundingBox();
  if (!peekBox) throw new Error('peek area has no bounding box');
  await page.mouse.move(
    peekBox.x + peekBox.width / 2,
    peekBox.y + peekBox.height / 2,
  );
  await page.mouse.down();
  await expect(page.getByTestId('word-text')).toBeVisible();
  await expect(page.getByTestId('word-text-alt')).toBeVisible();
  await page.mouse.up();
  await expect(page.getByTestId('word-text')).toHaveCount(0);
  const word1 = await holdToReadWord(page);
  expect(word1.length).toBeGreaterThan(0);
  await expect(page.getByTestId('word-masked')).toBeVisible();

  // Skip: a different word arrives, still masked by default.
  await page.getByTestId('skip-word-btn').click();
  await expect(page.getByTestId('word-text')).toHaveCount(0);
  const word2 = await holdToReadWord(page);
  expect(word2).not.toBe(word1);

  // Two-step start: 看词 (bilingual) → 遮住开画. The sidebar slides
  // away and the canvas does not move a pixel.
  await lookThenStartDrawing(page, word2);
  expectSameBox(await canvasBox(page), canvasBefore);
  await expect(page.getByTestId('timer-display')).toBeVisible();

  // Acceptance: with the sidebar closed there is no word on screen —
  // no plaintext anywhere, and the handle carries no word either.
  await expect(page.getByTestId('word-text')).toHaveCount(0);
  const handleText = await page
    .getByTestId('word-sidebar-handle')
    .textContent();
  expect(handleText ?? '').not.toContain(word2);

  // Draw: a center dot lands exactly at the canvas center, a drag paints.
  const box = await canvasBox(page);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.up();
  expect(await darkPixelNear(page, 0.5, 0.5)).toBe(true);
  const afterDot = await paintedPixels(page);
  expect(afterDot).toBeGreaterThan(0);
  await dragStroke(page, { fx: 0.15, fy: 0.2 }, { fx: 0.45, fy: 0.35 });
  expect(await paintedPixels(page)).toBeGreaterThan(afterDot);
  await expect(page.getByTestId('undo-btn')).toBeEnabled();

  // Reopen the sidebar mid-round: canvas still does not move; pause works.
  await page.getByTestId('word-sidebar-handle').click();
  await expect(page.getByTestId('sidebar-peek-area')).toBeVisible();
  expectSameBox(await canvasBox(page), canvasBefore);
  await page.getByTestId('pause-btn').click();
  await expect(page.getByTestId('timer-display')).toContainText('⏸');
  expectSameBox(await canvasBox(page), canvasBefore);

  // Reveal inside the sidebar: the word is finally plain text — in
  // both languages at once.
  await page.getByTestId('reveal-btn').click();
  await expect(page.getByTestId('reveal-word')).toBeVisible();
  await expect(page.getByTestId('word-text')).toHaveText(word2);
  await expect(page.getByTestId('word-text-alt')).toBeVisible();
  expect(
    (await page.getByTestId('word-text-alt').textContent())?.trim().length,
  ).toBeGreaterThan(0);

  // Tally +1, then next round: fresh masked word, cleared canvas.
  await page.getByTestId('tally-plus-btn').click();
  await expect(page.getByTestId('tally-count')).toHaveText('1');
  await page.getByTestId('next-round-btn').click();
  await expect(page.getByTestId('word-masked')).toBeVisible();
  await expect(page.getByTestId('word-text')).toHaveCount(0);
  await expect(page.getByTestId('reveal-word')).toHaveCount(0);
  await expect(page.getByTestId('undo-btn')).toBeDisabled();
  expect(await paintedPixels(page)).toBe(0);
  expectSameBox(await canvasBox(page), canvasBefore);
});

test('draw & guess: stroke lands right after peek → close (path A)', async ({
  page,
}) => {
  await page.setViewportSize({ width: 900, height: 1280 });
  await page.goto('/tools/draw-guess/');
  await expect(page.getByTestId('word-masked')).toBeVisible();

  // Peek, then close via the edge handle and draw immediately.
  await holdToReadWord(page);
  await page.getByTestId('word-sidebar-handle').click();
  await expectSidebarOffscreen(page);

  await dragStroke(page, { fx: 0.2, fy: 0.25 }, { fx: 0.5, fy: 0.45 });
  expect(await paintedPixels(page)).toBeGreaterThan(50);
});

test('draw & guess: stroke lands on open → close → draw, center maps correctly (path B)', async ({
  page,
}) => {
  await page.setViewportSize({ width: 900, height: 1280 });
  await page.goto('/tools/draw-guess/');
  await expect(page.getByTestId('word-masked')).toBeVisible();

  // No peeking at all: close the sidebar and draw straight away.
  await page.getByTestId('word-sidebar-close').click();
  await expectSidebarOffscreen(page);

  const box = await canvasBox(page);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.up();
  // Coordinate mapping: the dot read back at the canvas center is dark.
  expect(await darkPixelNear(page, 0.5, 0.5)).toBe(true);
  expect(await paintedPixels(page)).toBeGreaterThan(10);
});

test('draw & guess: rotation across orientations keeps the drawing and stays drawable', async ({
  page,
}) => {
  // Start landscape: close the sidebar (closing = start drawing),
  // draw. The sidebar is an overlay now, so "closed" means slid fully
  // off the right edge, not shrunk to zero width.
  await page.setViewportSize({ width: 844, height: 390 });
  await page.goto('/tools/draw-guess/');
  await expect(page.getByTestId('word-masked')).toBeVisible();
  await page.getByTestId('word-sidebar-close').click();
  await expectSidebarOffscreen(page);

  await dragStroke(page, { fx: 0.2, fy: 0.3 }, { fx: 0.5, fy: 0.5 });
  expect(await paintedPixels(page)).toBeGreaterThan(20);

  // Rounds no longer auto-fullscreen (only the fullscreen button may
  // request it), so normally there is nothing to leave here; the exit
  // stays as a harmless guard in case a prior step entered it.
  await page.evaluate(async () => {
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch {
        // not in fullscreen after all — nothing to leave
      }
    }
  });

  // Rotate to portrait: strokes are replayed at the new size, not lost,
  // and the canvas takes the full portrait stage.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(400);
  expect(await paintedPixels(page)).toBeGreaterThan(20);
  const box = await canvasBox(page);
  expect(box.width).toBeGreaterThan(350);
  expect(box.height).toBeGreaterThan(500);

  await dragStroke(page, { fx: 0.3, fy: 0.6 }, { fx: 0.6, fy: 0.75 });
  expect(await paintedPixels(page)).toBeGreaterThan(50);
});

test('draw & guess: time-up banner is an overlay — canvas never moves', async ({
  page,
}) => {
  await page.clock.install();
  await page.setViewportSize({ width: 900, height: 1280 });
  await page.goto('/tools/draw-guess/');
  await expect(page.getByTestId('word-masked')).toBeVisible();

  // Shortest round, then start (look at the word, then cover & draw).
  await page.getByRole('button', { name: '60秒' }).click();
  const canvasBefore = await canvasBox(page);
  await lookThenStartDrawing(page);

  await page.clock.runFor(61_000);
  await expect(page.getByTestId('timeup-banner')).toBeVisible();
  await expect(page.getByTestId('timer-display')).toContainText('0:00');
  expectSameBox(await canvasBox(page), canvasBefore);
});

test('draw & guess: phone viewport — canvas maximized, toolbar on screen', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/tools/draw-guess/');
  await expect(page.getByTestId('word-masked')).toBeVisible();

  // Old layout gave the canvas min(56vh, 540px) ≈ 472px here, below a
  // word strip and a page scroll. The stage must beat that comfortably.
  const box = await canvasBox(page);
  expect(box.height).toBeGreaterThan(Math.min(0.56 * 844, 540) + 40);
  expect(box.y).toBeLessThan(80);

  await page.getByTestId('word-sidebar-close').click();
  await expectSidebarOffscreen(page);
  expectSameBox(await canvasBox(page), box);

  // Whole bottom toolbar (3 rows) fits inside the viewport.
  const eraser = await page.getByTestId('eraser-btn').boundingBox();
  if (!eraser) throw new Error('eraser has no bounding box');
  expect(eraser.y + eraser.height).toBeLessThanOrEqual(844);
});

test('tools index lists the draw & guess game', async ({ page }) => {
  await page.goto('/tools/');
  const card = page.getByRole('link', { name: /draw & guess/i });
  await expect(card).toBeVisible();
  await expect(card).toHaveAttribute('href', '/tools/draw-guess/');
});

test('draw & guess: fullscreen button degrades silently and game stays playable', async ({
  page,
}) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (err) => pageErrors.push(String(err)));

  await page.setViewportSize({ width: 900, height: 1280 });
  await page.goto('/tools/draw-guess/');
  await expect(page.getByTestId('word-masked')).toBeVisible();

  // The fullscreen toggle lives on the stage top bar now (both
  // states). The sidebar starts open OVER the stage, so begin the
  // round first — that is also the phone reality: fullscreen is a
  // stage action, tapped while drawing. Headless Chrome may grant
  // or reject fullscreen/orientation-lock — either way the click
  // must not throw, alert, or break the game.
  await lookThenStartDrawing(page);
  const fsBtn = page.getByTestId('fullscreen-btn');
  await expect(fsBtn).toBeVisible();
  await fsBtn.click();
  await page.waitForTimeout(600);
  expect(pageErrors).toEqual([]);
  await page.evaluate(async () => {
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch {
        // not in fullscreen after all — nothing to leave
      }
    }
  });

  // Still fully playable afterwards.
  await dragStroke(page, { fx: 0.2, fy: 0.3 }, { fx: 0.5, fy: 0.5 });
  expect(await paintedPixels(page)).toBeGreaterThan(50);
  expect(pageErrors).toEqual([]);
});

for (const vp of [
  { width: 844, height: 390 },
  { width: 932, height: 430 },
]) {
  test(`draw & guess: landscape ${vp.width}x${vp.height} — right rail, canvas owns the screen`, async ({
    page,
  }) => {
    await page.setViewportSize(vp);
    await page.goto('/tools/draw-guess/');
    await expect(page.getByTestId('word-masked')).toBeVisible();

    // The sidebar starts open as an overlay: the canvas already has its
    // final geometry underneath it.
    const boxUnderSidebar = await canvasBox(page);

    // Close the sidebar (= look done, start drawing). Canvas must not
    // move or shrink by more than a pixel — the old layout squeezed it
    // into a ~1/3-height strip over three rows of giant buttons.
    await page.getByTestId('word-sidebar-close').click();
    await expectSidebarOffscreen(page);
    const box = await canvasBox(page);
    expectSameBox(box, boxUnderSidebar);

    // Headline metric: canvas height is at least 70% of the viewport
    // (this design lands around 85%).
    expect(box.height / vp.height).toBeGreaterThanOrEqual(0.7);
    expect(box.y).toBeLessThan(60);

    // The toolbar is a vertical rail on the right — same right edge as
    // the screen, (nearly) full height, narrow — never a bottom strip.
    const rail = await page.getByTestId('draw-toolbar').boundingBox();
    if (!rail) throw new Error('toolbar has no bounding box');
    expect(rail.x).toBeGreaterThanOrEqual(box.x + box.width - 1);
    expect(rail.x + rail.width).toBeGreaterThanOrEqual(vp.width - 2);
    expect(rail.width).toBeLessThan(200);
    expect(rail.height).toBeGreaterThan(vp.height * 0.8);
    // Nothing of the toolbar hangs below the canvas as a row: its tools
    // reach the bottom of the screen inside the rail.
    const clear = await page.getByTestId('clear-btn').boundingBox();
    if (!clear) throw new Error('clear has no bounding box');
    expect(clear.x).toBeGreaterThanOrEqual(rail.x - 1);

    // A stroke hugs the top edge and still lands — no fixed chrome is
    // eating the top of the board (the old "clipped at the top" feel).
    await page.mouse.move(box.x + box.width * 0.3, box.y + box.height * 0.05);
    await page.mouse.down();
    await page.mouse.up();
    expect(await darkPixelNear(page, 0.3, 0.05)).toBe(true);
    await dragStroke(page, { fx: 0.2, fy: 0.3 }, { fx: 0.55, fy: 0.6 });
    expect(await paintedPixels(page)).toBeGreaterThan(50);

    // Floating verdict buttons end the round into the sidebar result.
    await page.getByTestId('act-hit-btn').click();
    await expect(page.getByTestId('reveal-word')).toBeVisible();
    await expect(page.getByTestId('result-line')).toContainText('猜对啦');
    await expect(page.getByTestId('tally-count')).toHaveText('1');
    // The sidebar opening for the result still never resizes the canvas.
    expectSameBox(await canvasBox(page), box);

    // Next round returns to the masked pass phase; sidebar toggles keep
    // the canvas geometry within a pixel either way.
    await page.getByTestId('next-round-btn').click();
    await expect(page.getByTestId('word-masked')).toBeVisible();
    expectSameBox(await canvasBox(page), box);
    await page.getByTestId('word-sidebar-handle').click();
    await expectSidebarOffscreen(page);
    expectSameBox(await canvasBox(page), box);
    await page.getByTestId('word-sidebar-handle').click();
    await expect(page.getByTestId('sidebar-peek-area')).toBeVisible();
    expectSameBox(await canvasBox(page), box);

    // No horizontal scrolling at phone sizes, ever.
    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    expect(scrollWidth).toBeLessThanOrEqual(vp.width);
  });
}

test('draw & guess: landscape — slim handle, sidebar overlays the rail', async ({
  page,
}) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await page.goto('/tools/draw-guess/');
  await expect(page.getByTestId('word-masked')).toBeVisible();
  await page.getByTestId('word-sidebar-close').click();
  await expectSidebarOffscreen(page);

  // The handle is slim (32px, down from 48) and parked at the rail's
  // left edge, so it never sits on top of the rail's buttons.
  const handle = await page
    .getByTestId('word-sidebar-handle')
    .boundingBox();
  if (!handle) throw new Error('handle has no bounding box');
  expect(handle.width).toBeLessThanOrEqual(34);
  const rail = await page.getByTestId('draw-toolbar').boundingBox();
  if (!rail) throw new Error('toolbar has no bounding box');
  expect(handle.x + handle.width).toBeLessThanOrEqual(rail.x + 1);

  // Opening the sidebar slides it OVER the rail (canvas untouched).
  // Poll the slide-in: a raw boundingBox can catch the 200ms
  // transition mid-flight.
  const box = await canvasBox(page);
  await page.getByTestId('word-sidebar-handle').click();
  await expect
    .poll(
      async () => {
        const b = await page.getByTestId('word-sidebar').boundingBox();
        return b ? b.x : -1;
      },
      { timeout: 3000 },
    )
    .toBeLessThanOrEqual(844 - 320 + 2);
  const side = await page.getByTestId('word-sidebar').boundingBox();
  if (!side) throw new Error('sidebar has no bounding box');
  expect(side.x + side.width).toBeGreaterThanOrEqual(843);
  expect(side.x).toBeLessThan(rail.x + rail.width);
  expectSameBox(await canvasBox(page), box);
});

test('draw & guess: skip confirms eyes-closed and starts a truly fresh round', async ({
  page,
}) => {
  // Count vibrate calls from before the page loads: the swap feedback
  // must buzz (success pattern), and never throw where unsupported.
  await page.addInitScript(() => {
    const w = window as unknown as { __vibrateCalls: unknown[] };
    w.__vibrateCalls = [];
    const orig = navigator.vibrate?.bind(navigator);
    Object.defineProperty(navigator, 'vibrate', {
      configurable: true,
      value: (pattern: unknown) => {
        w.__vibrateCalls.push(pattern);
        try {
          return orig ? orig(pattern as VibratePattern) : true;
        } catch {
          return true;
        }
      },
    });
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/tools/draw-guess/');
  await expect(page.getByTestId('word-masked')).toBeVisible();

  const shownBefore = await holdToReadWord(page);
  const secretTokens = shownBefore.split(/\s+/).filter((t) => t.length > 1);

  // Skip in the pass phase: big overlay + buzz, and the overlay text
  // is static copy only — it must not leak the old (or new) word.
  await page.getByTestId('skip-word-btn').click();
  const fx = page.getByTestId('swap-feedback');
  await expect(fx).toBeVisible();
  const fxText = await fx.innerText();
  expect(fxText).toContain('已换新词');
  for (const token of secretTokens) {
    expect(fxText).not.toContain(token);
  }
  const vibrateCalls = await page.evaluate(
    () => (window as unknown as { __vibrateCalls: unknown[] }).__vibrateCalls.length,
  );
  expect(vibrateCalls).toBeGreaterThanOrEqual(1);
  // The word is masked again for the new pass — skipping never leaves
  // a readable word on screen.
  await expect(page.getByTestId('word-masked')).toBeVisible();

  // Mid-round skip = a NEW round: board wiped (pixels + undo history)
  // and the clock back to a full, un-started round.
  await lookThenStartDrawing(page);
  await dragStroke(page, { fx: 0.3, fy: 0.4 }, { fx: 0.7, fy: 0.6 });
  await dragStroke(page, { fx: 0.25, fy: 0.7 }, { fx: 0.6, fy: 0.85 });
  expect(await paintedPixels(page)).toBeGreaterThan(0);

  await page.getByTestId('word-sidebar-handle').click();
  await page.getByTestId('skip-word-btn').click();
  await expect(page.getByTestId('swap-feedback')).toBeVisible();
  expect(await paintedPixels(page)).toBe(0);
  await expect(page.getByTestId('undo-btn')).toBeDisabled();
  await expect(page.getByTestId('timer-display')).toContainText('1:30');
});

test('draw & guess: round-time chips sit up front and apply from the next round', async ({
  page,
}) => {
  await page.clock.install();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/tools/draw-guess/');

  // First thing in the open sidebar: the ⏱ section with all five
  // chips — no digging through Settings to change the round length.
  const selector = page.getByTestId('duration-selector');
  await expect(selector).toBeVisible();
  for (const id of [
    'duration-btn-30',
    'duration-btn-60',
    'duration-btn-90',
    'duration-btn-120',
    'duration-btn-unlimited',
  ]) {
    await expect(page.getByTestId(id)).toBeVisible();
  }
  await expect(selector).toContainText('下一轮生效');

  // Start a default 90s round, then change the pick mid-round: the
  // live clock must NOT jump — 35s in, still no time-up…
  await lookThenStartDrawing(page);
  await expect(page.getByTestId('timer-display')).toContainText('1:30');
  await page.getByTestId('word-sidebar-handle').click();
  await page.getByTestId('duration-btn-30').click();
  await page.getByTestId('start-draw-btn').click(); // 继续画 closes the panel
  await page.clock.runFor(35_000);
  await expect(page.getByTestId('timeup-banner')).toBeHidden();
  // …but the original 90s budget still ends the round on schedule.
  await page.clock.runFor(60_000);
  await expect(page.getByTestId('timeup-banner')).toBeVisible();

  // Next round picks up the 30s chip.
  await page.getByTestId('timeup-reveal-btn').click();
  await page.getByTestId('next-round-btn').click();
  await lookThenStartDrawing(page);
  await expect(page.getByTestId('timer-display')).toContainText('0:30');
  await page.clock.runFor(31_000);
  await expect(page.getByTestId('timeup-banner')).toBeVisible();
});

test('draw & guess: unlimited rounds count up and never time out', async ({
  page,
}) => {
  await page.clock.install();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/tools/draw-guess/');

  await page.getByTestId('duration-btn-unlimited').click();
  // The pending clock mirrors the pick before the round starts.
  await expect(page.getByTestId('timer-display')).toContainText('不限时');

  await lookThenStartDrawing(page);
  await expect(page.getByTestId('timer-display')).toContainText('0:00');
  // Five full minutes pass: no time-up, no dead state — the count-up
  // just keeps counting and the board stays drawable.
  await page.clock.runFor(300_000);
  await expect(page.getByTestId('timeup-banner')).toBeHidden();
  await expect(page.getByTestId('timer-display')).toContainText('5:00');
  await dragStroke(page, { fx: 0.3, fy: 0.4 }, { fx: 0.7, fy: 0.6 });
  expect(await paintedPixels(page)).toBeGreaterThan(0);

  // The round ends by hand, like the mode promises.
  await page.getByTestId('act-hit-btn').click();
  await expect(page.getByTestId('reveal-word')).toBeVisible();
  await expect(page.getByTestId('tally-count')).toHaveText('1');

  // The unlimited pick sticks for the next round too.
  await page.getByTestId('next-round-btn').click();
  await expect(page.getByTestId('timer-display')).toContainText('不限时');
});

test('draw & guess: fullscreen is button-only, two-state, and starting never enters it', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/tools/draw-guess/');
  const fsBtn = page.getByTestId('fullscreen-btn');
  await expect(fsBtn).toBeVisible();
  await expect(fsBtn).toContainText('全屏');
  await expect(fsBtn).not.toContainText('退出');

  // Starting a round must NOT enter fullscreen on its own.
  await lookThenStartDrawing(page);
  await page.waitForTimeout(300);
  expect(
    await page.evaluate(() => document.fullscreenElement),
  ).toBeNull();

  // The button toggles, and its label tracks the state.
  await fsBtn.click();
  await expect
    .poll(() => page.evaluate(() => document.fullscreenElement !== null))
    .toBe(true);
  await expect(fsBtn).toContainText('退出全屏');
  await fsBtn.click();
  await expect
    .poll(() => page.evaluate(() => document.fullscreenElement === null))
    .toBe(true);
  await expect(fsBtn).toContainText('全屏');
  await expect(fsBtn).not.toContainText('退出');
});

test('draw & guess: back button is guarded mid-round, normal otherwise', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.goto('/tools/draw-guess/');

  // No round running: back leaves immediately, like any page.
  await page.goBack();
  await expect(page).toHaveURL(/localhost:3100\/$/);

  // Mid-round: the first back press is intercepted (stay + hint)…
  await page.goto('/tools/draw-guess/');
  await lookThenStartDrawing(page);
  await page.goBack();
  await expect(page).toHaveURL(/\/tools\/draw-guess\/$/);
  await expect(page.getByTestId('back-guard-hint')).toBeVisible();
  // …and the second one really leaves.
  await page.goBack();
  await expect(page).toHaveURL(/localhost:3100\/$/);
});

test('draw & guess: back in fullscreen exits fullscreen first, round survives', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.goto('/tools/draw-guess/');
  await lookThenStartDrawing(page);
  await page.getByTestId('fullscreen-btn').click();
  await expect
    .poll(() => page.evaluate(() => document.fullscreenElement !== null))
    .toBe(true);

  await page.goBack();
  // Fullscreen is gone, but we are still in the game — the back press
  // was spent on leaving fullscreen, not on leaving the round.
  await expect
    .poll(() => page.evaluate(() => document.fullscreenElement === null))
    .toBe(true);
  await expect(page).toHaveURL(/\/tools\/draw-guess\/$/);
  await expect(page.getByTestId('draw-canvas')).toBeVisible();
});

test('draw & guess: the sidebar ✕ close button only closes — no fullscreen, round starts', async ({
  page,
}) => {
  // The exact path the user hit (2026-10-21): read the word in the
  // sidebar, tap the sidebar's ✕ (关闭） — that tap means "hide the
  // panel and start drawing", and must NEVER slip into fullscreen.
  // Fullscreen has exactly one door: the fullscreen button. The ✕
  // and the edge handle are the same gesture: toggle the panel (a
  // close before the round starts also starts the clock, as before).
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/tools/draw-guess/');
  await expect(page.getByTestId('word-masked')).toBeVisible();

  await page.getByTestId('show-word-btn').click();
  await expect(page.getByTestId('word-text')).toBeVisible();
  await page.getByTestId('word-sidebar-close').click();
  await page.waitForTimeout(400);
  expect(await page.evaluate(() => document.fullscreenElement)).toBeNull();

  // …and the round really did start: board drawable, clock counting.
  await dragStroke(page, { fx: 0.3, fy: 0.4 }, { fx: 0.7, fy: 0.6 });
  expect(await paintedPixels(page)).toBeGreaterThan(0);
  await expect
    .poll(async () =>
      (await page.getByTestId('timer-display').textContent()) ?? '',
    )
    .not.toContain('1:30');
  await expect(page.getByTestId('act-hit-btn')).toBeVisible();
});

test('draw & guess: no sidebar-close path ever changes the fullscreen state (portrait matrix)', async ({
  page,
}) => {
  // Regression lock for the 2026-10-21 22:08 report: "in portrait the
  // sidebar ✕ still slips into fullscreen; while already fullscreen it
  // only closes". Root cause was a stale pre-#52 bundle cached on the
  // user's device (the old startDraw auto-fullscreened, and its guard
  // made it a no-op when already fullscreen — exactly that asymmetry);
  // production code has exactly one fullscreen door, the top-bar
  // button. This matrix pins the invariant for EVERY close path in
  // BOTH states: closing the panel must never touch fullscreen.
  test.setTimeout(180_000);
  await page.setViewportSize({ width: 390, height: 844 });

  const sidebarClosed = async () => {
    const box = await page.getByTestId('word-sidebar').boundingBox();
    return box !== null && box.x >= 350;
  };
  const gotoFresh = async () => {
    await page.goto('/tools/draw-guess/');
    await expect(page.getByTestId('word-sidebar')).toBeVisible();
    await page.waitForTimeout(300);
  };

  // ── Windowed: every close path leaves fullscreen off ──────────
  await gotoFresh();
  await page.getByTestId('show-word-btn').click();
  await page.getByTestId('word-sidebar-close').click();
  await page.waitForTimeout(450);
  expect(await page.evaluate(() => document.fullscreenElement)).toBeNull();
  expect(await sidebarClosed()).toBe(true);

  await gotoFresh();
  await page.mouse.click(30, 400); // scrim strip left of the panel
  await page.waitForTimeout(450);
  expect(await page.evaluate(() => document.fullscreenElement)).toBeNull();
  expect(await sidebarClosed()).toBe(true);

  await gotoFresh();
  await page.getByTestId('word-sidebar-handle').click();
  await page.waitForTimeout(450);
  expect(await page.evaluate(() => document.fullscreenElement)).toBeNull();
  expect(await sidebarClosed()).toBe(true);

  await gotoFresh();
  await page.getByTestId('show-word-btn').click();
  await page.getByTestId('start-draw-btn').click();
  await page.waitForTimeout(450);
  expect(await page.evaluate(() => document.fullscreenElement)).toBeNull();
  expect(await sidebarClosed()).toBe(true);

  // ── Fullscreen: every close path keeps fullscreen on ──────────
  // (the round above is live; enter fullscreen via the ONE door)
  await page.getByTestId('fullscreen-btn').click();
  await expect
    .poll(() => page.evaluate(() => document.fullscreenElement !== null))
    .toBe(true);

  await page.getByTestId('word-sidebar-handle').click(); // open panel
  await page.getByTestId('word-sidebar-close').click();
  await page.waitForTimeout(450);
  expect(await page.evaluate(() => document.fullscreenElement)).not.toBeNull();
  expect(await sidebarClosed()).toBe(true);

  await page.getByTestId('word-sidebar-handle').click(); // open panel
  await page.mouse.click(30, 400); // scrim
  await page.waitForTimeout(450);
  expect(await page.evaluate(() => document.fullscreenElement)).not.toBeNull();
  expect(await sidebarClosed()).toBe(true);

  await page.getByTestId('word-sidebar-handle').click(); // open panel
  await page.getByTestId('word-sidebar-handle').click(); // close via handle
  await page.waitForTimeout(450);
  expect(await page.evaluate(() => document.fullscreenElement)).not.toBeNull();
  expect(await sidebarClosed()).toBe(true);

  await page.getByTestId('word-sidebar-handle').click(); // open panel
  await page.getByTestId('skip-word-btn').click(); // fresh round, phase pass
  await page.waitForTimeout(600);
  await page.getByTestId('show-word-btn').click();
  await page.getByTestId('start-draw-btn').click();
  await page.waitForTimeout(450);
  expect(await page.evaluate(() => document.fullscreenElement)).not.toBeNull();
  expect(await sidebarClosed()).toBe(true);
});
