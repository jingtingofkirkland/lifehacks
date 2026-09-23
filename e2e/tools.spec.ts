import { test, expect } from '@playwright/test';

test('tools index lists the key tools', async ({ page }) => {
  await page.goto('/tools/');

  await expect(
    page.getByRole('heading', { name: /tip calculator/i }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: /merge racer/i }),
  ).toBeVisible();
});

test('tip calculator computes tip and total for a bill', async ({ page }) => {
  await page.goto('/tools/tip-calculator/');

  // Default tip preset is 18%.
  await page.getByLabel(/bill amount/i).fill('100');

  await expect(page.getByText('$18.00', { exact: true }).first()).toBeVisible();
  await expect(
    page.getByText('$118.00', { exact: true }).first(),
  ).toBeVisible();

  // Splitting across 2 people shows the per-person amount: 118 / 2 = 59.
  await page.getByRole('button', { name: '+' }).click();
  await expect(page.getByText('Per Person')).toBeVisible();
  await expect(page.getByText('$59.00', { exact: true }).first()).toBeVisible();
});

test('merge racer: tapping a correct number-car pair advances the race', async ({
  page,
}) => {
  await page.goto('/tools/math-addition/');

  const target = page.locator('#targetNumber');
  await expect(target).toContainText(/\d+/);
  const targetNum = Number(await target.textContent());

  const values = (await page.locator('.number-car').allTextContents()).map((t) =>
    Number(t),
  );
  expect(values).toHaveLength(6);

  let pair: [number, number] | null = null;
  for (let i = 0; i < values.length && !pair; i += 1) {
    for (let j = i + 1; j < values.length; j += 1) {
      if (values[i] + values[j] === targetNum) pair = [i, j];
    }
  }
  expect(pair).not.toBeNull();

  await page.locator('.number-car').nth(pair![0]).click();
  await page.locator('.number-car').nth(pair![1]).click();

  // Correct merge registers in the stats (regression: scoring must work).
  await expect(page.locator('#feedbackText')).toContainText('Turbo merge!');
  await expect(page.locator('#streakStat')).toHaveText('1');
});

test('merge racer: a wrong pair bounces and the worksheet still prints', async ({
  page,
}) => {
  await page.goto('/tools/math-addition/');

  const targetNum = Number(await page.locator('#targetNumber').textContent());
  const values = (await page.locator('.number-car').allTextContents()).map((t) =>
    Number(t),
  );
  let pair: [number, number] | null = null;
  for (let i = 0; i < values.length && !pair; i += 1) {
    for (let j = i + 1; j < values.length; j += 1) {
      if (values[i] + values[j] !== targetNum) pair = [i, j];
    }
  }
  expect(pair).not.toBeNull();
  await page.locator('.number-car').nth(pair![0]).click();
  await page.locator('.number-car').nth(pair![1]).click();
  await expect(page.locator('#feedbackText')).toContainText('Close');

  // Worksheet: a sheet generates and the Name line stays flexible on mobile
  // (regression for the mobile overflow fix).
  await page.locator('#generate-btn').click();
  await expect(
    page.locator('#worksheet-grid .sheet-problem').first(),
  ).toBeVisible();
  await expect(page.locator('.name-line')).toBeVisible();
  await expect(page.locator('.name-line .name-blank')).toBeVisible();
});
