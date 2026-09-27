import { test, expect, Page } from '@playwright/test';

/**
 * Meta Pixel must stay completely silent outside production.
 *
 * The root layout only initializes fbq when
 * window.location.hostname === 'lifehacks.zeey-app.net', and every
 * trackEvent call is gated the same way. CI serves the static export on
 * localhost, so these tests assert the disabled path: no fbq, no requests
 * to Meta, and the site still works.
 */

const META_HOSTS = ['connect.facebook.net', 'www.facebook.com'];

async function watchMetaRequests(page: Page): Promise<string[]> {
  const hits: string[] = [];
  page.on('request', (req) => {
    if (META_HOSTS.some((h) => req.url().includes(h))) hits.push(req.url());
  });
  return hits;
}

async function fbqType(page: Page): Promise<string> {
  return page.evaluate(
    () => typeof (window as unknown as { fbq?: unknown }).fbq,
  );
}

test('pixel never initializes on non-production hosts', async ({ page }) => {
  const hits = await watchMetaRequests(page);
  const debugLogs: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'debug') debugLogs.push(msg.text());
  });

  await page.goto('/tools/education/');
  await expect(
    page.getByRole('heading', { name: /^education$/i }),
  ).toBeVisible();

  // fbq is never defined off production, so no PageView can be queued…
  expect(await fbqType(page)).toBe('undefined');
  // …and no request ever leaves for Meta.
  expect(hits).toEqual([]);
  // The disabled branch logs once for debuggability.
  expect(debugLogs.some((t) => t.includes('[pixel] disabled'))).toBe(true);
});

test('game interactions stay silent off production and the game still works', async ({
  page,
}) => {
  const hits = await watchMetaRequests(page);
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(String(e)));

  await page.goto('/tools/math-bubble-pop/');
  await expect(page.locator('.bubble').first()).toBeVisible();

  // Tapping bubbles would fire GameStarted on production; here it must
  // no-op without breaking the game.
  await page.evaluate(() => {
    document
      .querySelector('.bubble')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  });

  expect(await fbqType(page)).toBe('undefined');
  expect(hits).toEqual([]);
  expect(errors).toEqual([]);
});

test('messenger bubble click sends no pixel request off production', async ({
  page,
}) => {
  const hits = await watchMetaRequests(page);

  await page.goto('/');
  const bubble = page.getByRole('link', { name: /chat with us on messenger/i });
  await expect(bubble).toBeVisible();

  // Dispatch the click (would fire Reachout on production); the popup
  // target is irrelevant here — only pixel silence is asserted.
  await page.evaluate(() => {
    document
      .querySelector('a[aria-label="Chat with us on Messenger"]')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  });

  expect(await fbqType(page)).toBe('undefined');
  expect(hits).toEqual([]);
});
