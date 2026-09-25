import { test, expect } from '@playwright/test';

/**
 * Bubble Pop drift: bubbles should slowly wander around the field (not sit
 * in place), start without severe overlap, and never get clipped outside
 * the field — including on a 390px phone.
 */

interface DriftSample {
  fieldW: number;
  fieldH: number;
  size: number;
  pts: { x: number; y: number }[];
}

async function driftPositions(
  page: import('@playwright/test').Page,
): Promise<DriftSample> {
  return page.evaluate(() => {
    const wraps = Array.from(
      document.querySelectorAll('.bubble-drift'),
    ) as HTMLElement[];
    const field = document.getElementById('bubbleField') as HTMLElement;
    const btn = document.querySelector('.bubble') as HTMLElement | null;
    const size = btn ? btn.offsetWidth : 84;
    const read = (w: HTMLElement): { x: number; y: number } => {
      const t = getComputedStyle(w).transform;
      if (!t || t === 'none') return { x: 0, y: 0 };
      const m = new DOMMatrixReadOnly(t);
      return { x: m.m41, y: m.m42 };
    };
    return {
      fieldW: field.clientWidth,
      fieldH: field.clientHeight,
      size,
      pts: wraps.map(read),
    };
  });
}

test('bubble pop: bubbles drift slowly and stay inside the field', async ({
  page,
}) => {
  await page.goto('/tools/math-bubble-pop/');
  await page.waitForSelector('.bubble-drift');

  const before = await driftPositions(page);
  expect(before.pts.length).toBeGreaterThanOrEqual(5);

  await page.waitForTimeout(2000);
  const after = await driftPositions(page);
  expect(after.pts).toHaveLength(before.pts.length);

  // At least one bubble must have visibly wandered (drift is actually on).
  const moved = after.pts.map((p, i) =>
    Math.hypot(p.x - before.pts[i].x, p.y - before.pts[i].y),
  );
  expect(Math.max(...moved)).toBeGreaterThan(10);

  // Every bubble stays fully inside the field (y >= 15 leaves headroom for
  // the bob so nothing clips at the top).
  for (const p of after.pts) {
    expect(p.x).toBeGreaterThanOrEqual(-1);
    expect(p.x).toBeLessThanOrEqual(after.fieldW - after.size + 1);
    expect(p.y).toBeGreaterThanOrEqual(15);
    expect(p.y).toBeLessThanOrEqual(after.fieldH - after.size + 1);
  }
});

test('bubble pop: initial layout has no severe overlap', async ({ page }) => {
  await page.goto('/tools/math-bubble-pop/');
  await page.waitForSelector('.bubble-drift');

  // Sample immediately: drift may legitimately cause brief overlap later,
  // but the starting layout must be clean.
  const d = await driftPositions(page);
  const minDist = d.size * 0.75;
  for (let i = 0; i < d.pts.length; i += 1) {
    for (let j = i + 1; j < d.pts.length; j += 1) {
      const dist = Math.hypot(d.pts[i].x - d.pts[j].x, d.pts[i].y - d.pts[j].y);
      expect(dist).toBeGreaterThanOrEqual(minDist);
    }
  }
});

test.use({ viewport: { width: 390, height: 844 } });
test('bubble pop: no bubble is clipped outside the field on mobile', async ({
  page,
}) => {
  await page.goto('/tools/math-bubble-pop/');
  await page.waitForSelector('.bubble-drift');

  const d = await driftPositions(page);
  expect(d.size).toBe(72); // mobile bubble size from the CSS media query
  expect(d.pts.length).toBeGreaterThanOrEqual(5);

  // Let them drift for a while, then confirm everything is still inside.
  await page.waitForTimeout(2500);
  const later = await driftPositions(page);
  for (const p of later.pts) {
    expect(p.x).toBeGreaterThanOrEqual(-1);
    expect(p.x).toBeLessThanOrEqual(later.fieldW - later.size + 1);
    expect(p.y).toBeGreaterThanOrEqual(15);
    expect(p.y).toBeLessThanOrEqual(later.fieldH - later.size + 1);
  }
});
