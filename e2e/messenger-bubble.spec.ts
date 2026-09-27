import { test, expect } from '@playwright/test';

const MESSENGER_URL = 'https://m.me/100077216003847';

// Pages that must render the global floating Messenger bubble,
// including the homepage (it has no in-page contact entry).
const PAGES = ['/', '/tools/education/', '/tools/', '/tools/math-addition/'];

test.describe('floating Messenger bubble', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  for (const path of PAGES) {
    test(`bubble is visible and links to Messenger on ${path} (mobile)`, async ({
      page,
    }) => {
      await page.goto(path);
      const bubble = page.locator('[data-testid="messenger-bubble"]');
      await expect(bubble).toBeVisible();
      await expect(bubble).toHaveAttribute('href', MESSENGER_URL);
      await expect(bubble).toHaveAttribute('target', '_blank');

      // Fixed to the bottom-right corner via the wrapper.
      const wrap = page.locator('[data-testid="messenger-bubble-wrap"]');
      const position = await wrap.evaluate(
        (el) => window.getComputedStyle(el).position,
      );
      expect(position).toBe('fixed');
      const box = await wrap.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x + box!.width).toBeGreaterThan(330);
      expect(box!.y + box!.height).toBeGreaterThan(780);
    });
  }

  test('bubble is dismissible on mobile and stays dismissed', async ({
    page,
  }) => {
    await page.goto('/tools/math-addition/');
    const bubble = page.locator('[data-testid="messenger-bubble"]');
    const dismiss = page.locator('[data-testid="messenger-bubble-dismiss"]');
    await expect(bubble).toBeVisible();
    // A fixed bubble can cover game controls on small screens, so mobile
    // users get a way to remove it.
    await expect(dismiss).toBeVisible();
    await dismiss.click();
    await expect(bubble).toBeHidden();
    await page.reload();
    await expect(bubble).toBeHidden();
  });

  test('bubble sits above the desktop feedback pills', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/tools/math-addition/');
    const wrap = page.locator('[data-testid="messenger-bubble-wrap"]');
    const feedback = page.locator('[data-testid="feedback-desktop"]');
    await expect(wrap).toBeVisible();
    await expect(feedback).toBeVisible();
    // No dismiss control needed on desktop: the bubble floats clear of content.
    await expect(
      page.locator('[data-testid="messenger-bubble-dismiss"]'),
    ).toBeHidden();
    const wrapBox = await wrap.boundingBox();
    const feedbackBox = await feedback.boundingBox();
    expect(wrapBox).not.toBeNull();
    expect(feedbackBox).not.toBeNull();
    // The bubble's bottom edge must clear the top of the feedback stack.
    expect(wrapBox!.y + wrapBox!.height).toBeLessThanOrEqual(
      feedbackBox!.y + 4,
    );
  });
});
