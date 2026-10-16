import { expect, test } from '@playwright/test';

/**
 * Kangaroo 2027 cohort (/kangaroo-2027/cohort/, IDEA-20261012-01):
 * the 20-week companion plan — live week banner, four phase cards
 * routing into the existing assets, key season dates, and the
 * newsletter as the signup. Also covers the two inbound links
 * (WA war room card and the kangaroo prep hub card).
 */
test.describe('kangaroo 2027 cohort', () => {
  test('cohort page loads with the live status banner and four phases', async ({
    page,
  }) => {
    await page.goto('/kangaroo-2027/cohort/');
    await expect(
      page.getByRole('heading', {
        name: 'The Kangaroo Cohort: 20 Weeks to Contest Day',
      }),
    ).toBeVisible();

    // Live banner: whatever the calendar says today, it renders a
    // non-empty status line (week / countdown / taper / race / done).
    const banner = page.getByTestId('cohort-status');
    await expect(banner).toBeVisible();
    await expect(banner).toContainText(/Week|cohort|contest/i);

    // Four phases, in order, with their week ranges.
    for (const [id, weeks] of [
      [1, 'Weeks 1–6'],
      [2, 'Weeks 7–12'],
      [3, 'Weeks 13–17'],
      [4, 'Weeks 18–20'],
    ] as const) {
      const card = page.getByTestId(`cohort-phase-${id}`);
      await expect(card).toBeVisible();
      await expect(card).toContainText(weeks);
    }
    await expect(page.getByTestId('cohort-phase-1')).toContainText(
      'Build the base',
    );
    await expect(page.getByTestId('cohort-phase-4')).toContainText(
      'Mock contests, then taper',
    );
  });

  test('phases route into the existing assets and the season dates are shown', async ({
    page,
  }) => {
    await page.goto('/kangaroo-2027/cohort/');
    // Phase 1 starts from the readiness check.
    await expect(
      page
        .getByTestId('cohort-phase-1')
        .locator('a[href="/tools/kangaroo/readiness/"]'),
    ).toBeVisible();
    // Phase 4 ends at the war rooms.
    await expect(
      page
        .getByTestId('cohort-phase-4')
        .locator('a[href="/kangaroo-2027-wa/"]'),
    ).toBeVisible();
    // The dates the plan is paced by.
    await expect(page.getByText('December 31, 2026').first()).toBeVisible();
    await expect(page.getByText('March 18, 2027').first()).toBeVisible();
    // Signup is the shared newsletter CTA, not a new form.
    const cta = page.locator('a[href="/newsletter/"]').first();
    await expect(cta).toBeVisible();
    await expect(cta).toContainText('Subscribe free');
  });

  test('WA war room links into the cohort', async ({ page }) => {
    await page.goto('/kangaroo-2027-wa/');
    const link = page.locator('a[href="/kangaroo-2027/cohort/"]').first();
    await expect(link).toBeVisible();
    await expect(link).toContainText('cohort');
  });

  test('kangaroo prep hub links into the cohort', async ({ page }) => {
    await page.goto('/tools/kangaroo/');
    const card = page.getByTestId('kq-cohort-card');
    await expect(card).toBeVisible();
    await expect(card).toContainText('20-week plan');
  });
});
