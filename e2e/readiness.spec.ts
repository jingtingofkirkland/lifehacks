import { expect, test } from '@playwright/test';

test.describe('Kangaroo readiness check', () => {
  test('answering all 9 questions shows topic strengths and the report gate', async ({
    page,
  }) => {
    await page.goto('/tools/kangaroo/readiness/');

    await expect(
      page.getByRole('heading', { name: 'Kangaroo Readiness Check' }),
    ).toBeVisible();

    const sections = page.locator('section[data-testid^="kr-question-"]');
    await expect(sections).toHaveCount(9);

    // Answer every question with its first option.
    for (let i = 0; i < 9; i++) {
      await sections.nth(i).locator('[role="group"] button').first().click();
    }

    await page.getByTestId('kr-finish').click();

    const results = page.getByTestId('kr-results');
    await expect(results).toBeVisible();
    await expect(results.getByText('Topic strengths')).toBeVisible();
    await expect(
      results.locator('[data-testid^="kr-topic-"]'),
    ).toHaveCount(6);
    await expect(results.getByText('Your practice path')).toBeVisible();

    // Full report is gated behind the newsletter subscribe step.
    const gate = page.getByTestId('kr-report-gate');
    await expect(gate).toBeVisible();
    await expect(page.getByTestId('kr-subscribe')).toHaveAttribute(
      'href',
      '/newsletter/',
    );

    // Unlocking reveals the printable report with the 4-week plan.
    await page.getByTestId('kr-unlock').click();
    await expect(page.getByTestId('kr-print')).toBeVisible();
    await expect(page.getByText('Your 4-week practice plan')).toBeVisible();
    await expect(page.getByText('Question review')).toBeVisible();

    // Below the report sits the optional email-my-report block (Top 2):
    // it offers an emailed copy without ever gating the report itself.
    const emailBlock = page.getByTestId('kr-email-report');
    await expect(emailBlock).toBeVisible();
    await expect(emailBlock).toContainText(/Want this report in your inbox/);
  });

  test('kangaroo hub links to the readiness check', async ({ page }) => {
    await page.goto('/tools/kangaroo/');
    await expect(page.getByTestId('kq-readiness-card')).toHaveAttribute(
      'href',
      '/tools/kangaroo/readiness/',
    );
  });

  test('education page links to the readiness check', async ({ page }) => {
    await page.goto('/tools/education/');
    await expect(
      page.locator('a[href="/tools/kangaroo/readiness/"]'),
    ).toBeVisible();
  });
});
