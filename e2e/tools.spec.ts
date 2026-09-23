import { test, expect } from '@playwright/test';

test('tools index lists the key tools', async ({ page }) => {
  await page.goto('/tools/');

  await expect(
    page.getByRole('heading', { name: /tip calculator/i }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: /math addition for kids/i }),
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

test('math addition tool: answering practice problems updates stats', async ({
  page,
}) => {
  await page.goto('/tools/math-addition/');

  // Practice lives behind the "Practice" tab; the default tab is "Learn".
  await page.locator('#tab-practice').click();

  const problem = page.locator('#problem');
  await expect(problem).toContainText(/\+/);

  const text = (await problem.textContent()) ?? '';
  const m = text.match(/(\d+)\s*\+\s*(\d+)/);
  expect(m).not.toBeNull();
  const answer = String(Number(m![1]) + Number(m![2]));

  await page.locator('#answer').fill(answer);
  await page.locator('#answer').press('Enter');

  // Correct answer registers in the stats (regression: scoring must work).
  await expect(page.locator('#correct-stat')).toHaveText('1');
  await expect(page.locator('#streak-stat')).toHaveText('1');
});
