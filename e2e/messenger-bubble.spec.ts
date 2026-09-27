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

      // Fixed to the bottom-right corner.
      const position = await bubble.evaluate((el) =>
        window.getComputedStyle(el).position,
      );
      expect(position).toBe('fixed');
      const box = await bubble.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x + box!.width).toBeGreaterThan(340);
      expect(box!.y + box!.height).toBeGreaterThan(790);
    });
  }

  test('bubble never covers Merge Racer number cars (mobile)', async ({
    page,
  }) => {
    await page.goto('/tools/math-addition/');
    const bubble = page.locator('[data-testid="messenger-bubble"]');
    await expect(bubble).toBeVisible();
    const bubbleBox = await bubble.boundingBox();
    const carsBox = await page.locator('.math-tool .cars').boundingBox();
    expect(bubbleBox).not.toBeNull();
    expect(carsBox).not.toBeNull();
    const overlap = !(
      bubbleBox!.x >= carsBox!.x + carsBox!.width ||
      bubbleBox!.x + bubbleBox!.width <= carsBox!.x ||
      bubbleBox!.y >= carsBox!.y + carsBox!.height ||
      bubbleBox!.y + bubbleBox!.height <= carsBox!.y
    );
    expect(overlap).toBe(false);
  });

  test('bubble sits above the desktop feedback pills', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/tools/math-addition/');
    const bubble = page.locator('[data-testid="messenger-bubble"]');
    const feedback = page.locator('[data-testid="feedback-desktop"]');
    await expect(bubble).toBeVisible();
    await expect(feedback).toBeVisible();
    const bubbleBox = await bubble.boundingBox();
    const feedbackBox = await feedback.boundingBox();
    expect(bubbleBox).not.toBeNull();
    expect(feedbackBox).not.toBeNull();
    // The bubble's bottom edge must clear the top of the feedback stack.
    expect(bubbleBox!.y + bubbleBox!.height).toBeLessThanOrEqual(
      feedbackBox!.y + 4,
    );
  });
});
