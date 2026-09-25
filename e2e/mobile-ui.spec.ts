import { test, expect } from '@playwright/test';

type Box = { x: number; y: number; width: number; height: number };

function boxesOverlap(a: Box, b: Box): boolean {
  return !(
    a.x >= b.x + b.width ||
    a.x + a.width <= b.x ||
    a.y >= b.y + b.height ||
    a.y + a.height <= b.y
  );
}

test.describe('mobile floating feedback buttons', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('feedback buttons never cover Merge Racer number cars', async ({
    page,
  }) => {
    await page.goto('/tools/math-addition/');

    // Desktop floating pills must be hidden; the in-flow mobile row is shown.
    await expect(page.locator('[data-testid="feedback-desktop"]')).toBeHidden();
    const mobile = page.locator('[data-testid="feedback-mobile"]');
    await expect(mobile).toBeVisible();

    const carsBox = await page.locator('.math-tool .cars').boundingBox();
    const mobileBox = await mobile.boundingBox();
    expect(carsBox).not.toBeNull();
    expect(mobileBox).not.toBeNull();
    expect(boxesOverlap(carsBox!, mobileBox!)).toBe(false);
  });

  test('feedback buttons never cover Tools page cards', async ({ page }) => {
    await page.goto('/tools/');

    const mobile = page.locator('[data-testid="feedback-mobile"]');
    await expect(mobile).toBeVisible();
    const mobileBox = await mobile.boundingBox();
    expect(mobileBox).not.toBeNull();

    const cards = page.locator('article a[href^="/tools/"]');
    expect(await cards.count()).toBeGreaterThan(0);
    for (let i = 0; i < (await cards.count()); i += 1) {
      const box = await cards.nth(i).boundingBox();
      if (box) {
        expect(boxesOverlap(box, mobileBox!)).toBe(false);
      }
    }
  });

  test('desktop keeps the floating pills', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/tools/math-addition/');
    await expect(
      page.locator('[data-testid="feedback-desktop"]'),
    ).toBeVisible();
    await expect(page.locator('[data-testid="feedback-mobile"]')).toBeHidden();
  });
});

test.describe('merge racer equation + car animation', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('result slot shows the target number and follows each new round', async ({
    page,
  }) => {
    await page.goto('/tools/math-addition/');

    const target = page.locator('#targetNumber');
    const sumSlot = page.locator('#sumSlot');
    await expect(target).toContainText(/\d+/);
    // "? + ? = <target>"
    await expect(sumSlot).toHaveText((await target.textContent())!.trim());

    // Play a correct pair: after the next round renders, the result slot
    // must show the new target number.
    const targetNum = Number(await target.textContent());
    const values = (await page.locator('.number-car').allTextContents()).map(
      (t) => Number(t),
    );
    let pair: [number, number] | null = null;
    for (let i = 0; i < values.length && !pair; i += 1) {
      for (let j = i + 1; j < values.length; j += 1) {
        if (values[i] + values[j] === targetNum) pair = [i, j];
      }
    }
    expect(pair).not.toBeNull();
    await page.locator('.number-car').nth(pair![0]).click();
    await page.locator('.number-car').nth(pair![1]).click();
    await expect(page.locator('#feedbackText')).toContainText('Turbo merge!');
    await expect(page.locator('#feedbackText')).toContainText('Find a pair', {
      timeout: 5000,
    });
    await expect(sumSlot).toHaveText((await target.textContent())!.trim());
  });

  test('racer has an idle driving animation', async ({ page }) => {
    await page.goto('/tools/math-addition/');
    const animName = await page
      .locator('#racer img')
      .evaluate((el) => getComputedStyle(el).animationName);
    expect(animName).toContain('idleBob');
  });
});
