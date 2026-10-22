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

  // Hold to peek; release re-masks immediately.
  const word1 = await holdToReadWord(page);
  expect(word1.length).toBeGreaterThan(0);
  await expect(page.getByTestId('word-masked')).toBeVisible();

  // Skip: a different word arrives, still masked by default.
  await page.getByTestId('skip-word-btn').click();
  await expect(page.getByTestId('word-text')).toHaveCount(0);
  const word2 = await holdToReadWord(page);
  expect(word2).not.toBe(word1);

  // Start drawing: sidebar slides away, canvas does not move a pixel.
  await page.getByTestId('start-draw-btn').click();
  await expectSidebarOffscreen(page);
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

  // Reveal inside the sidebar: the word is finally plain text.
  await page.getByTestId('reveal-btn').click();
  await expect(page.getByTestId('reveal-word')).toBeVisible();
  await expect(page.getByTestId('word-text')).toHaveText(word2);

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
  // Start landscape (workbench mode): close the sidebar, draw.
  await page.setViewportSize({ width: 844, height: 390 });
  await page.goto('/tools/draw-guess/');
  await expect(page.getByTestId('word-masked')).toBeVisible();
  await page.getByTestId('word-sidebar-close').click();
  const sidebar = page.getByTestId('word-sidebar');
  await expect
    .poll(
      async () => {
        const b = await sidebar.boundingBox();
        return b ? b.width : -1;
      },
      { timeout: 3000 },
    )
    .toBeLessThanOrEqual(2);

  await dragStroke(page, { fx: 0.2, fy: 0.3 }, { fx: 0.5, fy: 0.5 });
  expect(await paintedPixels(page)).toBeGreaterThan(20);

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

  // Shortest round, then start.
  await page.getByRole('button', { name: '60秒' }).click();
  const canvasBefore = await canvasBox(page);
  await page.getByTestId('start-draw-btn').click();
  await expectSidebarOffscreen(page);

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

  // The big fullscreen button is right by the word card. Headless Chrome
  // may grant or reject fullscreen/orientation-lock — either way the
  // click must not throw, alert, or break the game.
  const fsBtn = page.getByTestId('fullscreen-btn');
  await expect(fsBtn).toBeVisible();
  await fsBtn.click();
  await page.waitForTimeout(600);
  expect(pageErrors).toEqual([]);

  // Still fully playable afterwards.
  await page.getByTestId('start-draw-btn').click();
  await expectSidebarOffscreen(page);
  await dragStroke(page, { fx: 0.2, fy: 0.3 }, { fx: 0.5, fy: 0.5 });
  expect(await paintedPixels(page)).toBeGreaterThan(50);
  expect(pageErrors).toEqual([]);
});

test('draw & guess: landscape — sidebar is a side workbench, canvas expands on close', async ({
  page,
}) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await page.goto('/tools/draw-guess/');
  await expect(page.getByTestId('word-masked')).toBeVisible();

  // Sidebar open = workbench on the right; canvas owns the left and is
  // not covered by it (no overlay in landscape).
  const sidebar = page.getByTestId('word-sidebar');
  const sideBox = await sidebar.boundingBox();
  if (!sideBox) throw new Error('sidebar has no bounding box');
  const openBox = await canvasBox(page);
  expect(openBox.x).toBeLessThan(40);
  expect(openBox.x + openBox.width).toBeLessThanOrEqual(sideBox.x + 1);
  expect(sideBox.x + sideBox.width).toBeLessThanOrEqual(845);

  // Drawable immediately, with the workbench open.
  await dragStroke(page, { fx: 0.25, fy: 0.3 }, { fx: 0.55, fy: 0.55 });
  expect(await paintedPixels(page)).toBeGreaterThan(20);

  // Close the workbench: the canvas expands to (nearly) full width and
  // the drawing survives the resize.
  await page.getByTestId('word-sidebar-close').click();
  await expect
    .poll(
      async () => {
        const b = await sidebar.boundingBox();
        return b ? b.width : -1;
      },
      { timeout: 3000 },
    )
    .toBeLessThanOrEqual(2);
  const closedBox = await canvasBox(page);
  expect(closedBox.width).toBeGreaterThan(openBox.width + 200);
  expect(await paintedPixels(page)).toBeGreaterThan(20);

  // Coordinate mapping still exact after the expansion.
  await page.mouse.move(
    closedBox.x + closedBox.width / 2,
    closedBox.y + closedBox.height / 2,
  );
  await page.mouse.down();
  await page.mouse.up();
  expect(await darkPixelNear(page, 0.5, 0.5)).toBe(true);
});
