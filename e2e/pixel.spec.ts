import { test, expect, Page } from '@playwright/test';

/**
 * Meta Pixel tracking assertions.
 *
 * The pixel snippet in the root layout defines window.fbq as a call queue
 * until fbevents.js loads. We abort the fbevents.js request so no call ever
 * leaves the browser, then assert on the queued calls.
 */

async function blockPixelScript(page: Page) {
  await page.route('**/fbevents.js', (route) => route.abort());
}

async function fbqQueue(page: Page): Promise<unknown[][]> {
  return page.evaluate(() => {
    const w = window as unknown as { fbq?: { queue?: unknown[][] } };
    return w.fbq?.queue ?? [];
  });
}

function hasCall(
  queue: unknown[][],
  method: string,
  event: string,
  params?: Record<string, unknown>,
): boolean {
  return queue.some((args) => {
    if (args[0] !== method || args[1] !== event) return false;
    if (!params) return true;
    const p = (args[2] ?? {}) as Record<string, unknown>;
    return Object.entries(params).every(([k, v]) => p[k] === v);
  });
}

test('education page fires PageView on load', async ({ page }) => {
  await blockPixelScript(page);
  await page.goto('/tools/education/');

  await expect(
    page.getByRole('heading', { name: /^education$/i }),
  ).toBeVisible();

  const queue = await fbqQueue(page);
  expect(hasCall(queue, 'track', 'PageView')).toBe(true);
});

test('game page fires PageView on load', async ({ page }) => {
  await blockPixelScript(page);
  await page.goto('/tools/math-bubble-pop/');

  await expect(page.locator('.bubble').first()).toBeVisible();

  const queue = await fbqQueue(page);
  expect(hasCall(queue, 'track', 'PageView')).toBe(true);
});

test('bubble pop: first tap fires GameStarted exactly once', async ({
  page,
}) => {
  await blockPixelScript(page);
  await page.goto('/tools/math-bubble-pop/');

  await expect(page.locator('.bubble').first()).toBeVisible();

  // Tap two bubbles with synthetic clicks: the game's handlers fire without
  // Playwright's actionability waits (the float animation never settles).
  await page.evaluate(() => {
    const bubbles = document.querySelectorAll('.bubble');
    for (const el of [bubbles[0], bubbles[1]]) {
      el?.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true }),
      );
    }
  });

  const queue = await fbqQueue(page);
  const started = queue.filter(
    (args) => args[0] === 'trackCustom' && args[1] === 'GameStarted',
  );
  expect(started).toHaveLength(1);
  expect((started[0][2] as Record<string, unknown>)['game']).toBe(
    'bubble_pop',
  );
});

test('bubble pop: generating a worksheet fires WorksheetPrinted', async ({
  page,
}) => {
  await blockPixelScript(page);
  await page.goto('/tools/math-bubble-pop/');

  await page.locator('#generate-btn').click();

  const queue = await fbqQueue(page);
  expect(
    hasCall(queue, 'trackCustom', 'WorksheetPrinted', { game: 'bubble_pop' }),
  ).toBe(true);
});

test('education game card click fires GameCardClick', async ({ page }) => {
  await blockPixelScript(page);
  await page.goto('/tools/education/');

  const card = page.getByRole('link', { name: /merge racer/i });
  await expect(card).toBeVisible();

  // Dispatch the click and read the queue synchronously: React's onClick
  // handler runs during dispatch, before the client-side navigation.
  const queue = await page.evaluate(() => {
    document
      .querySelector('a[href="/tools/math-addition/"]')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    const w = window as unknown as { fbq?: { queue?: unknown[][] } };
    return w.fbq?.queue ?? [];
  });

  expect(
    hasCall(queue, 'trackCustom', 'GameCardClick', { game: 'merge_racer' }),
  ).toBe(true);
});
