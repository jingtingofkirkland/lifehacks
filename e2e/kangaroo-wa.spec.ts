import { test, expect } from '@playwright/test';

/**
 * Math Kangaroo 2027 Washington war room (/kangaroo-2027-wa/): the
 * WA-local layer — key dates, how centers and invitation codes work,
 * Eastside center options, pitfalls, FAQ, and the routes into prep and
 * the newsletter. Also covers the /tools hub card that links here.
 */
test.describe('kangaroo 2027 WA war room', () => {
  test('WA page loads with key dates and center guidance', async ({
    page,
  }) => {
    await page.goto('/kangaroo-2027-wa/');
    await expect(
      page.getByRole('heading', {
        name: 'Math Kangaroo 2027 in Washington State',
      }),
    ).toBeVisible();
    // Key official dates: regular deadline and competition day.
    await expect(page.getByText('December 31, 2026').first()).toBeVisible();
    await expect(page.getByText('March 18, 2027').first()).toBeVisible();
    // The WA differentiators: invitation codes and the pitfalls section.
    await expect(page.getByText(/Invitation Code/).first()).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Five WA parent pitfalls' }),
    ).toBeVisible();
  });

  test('WA page routes into prep tools, national war room and newsletter', async ({
    page,
  }) => {
    await page.goto('/kangaroo-2027-wa/');
    await expect(
      page.locator('a[href="/tools/kangaroo/"]').first(),
    ).toBeVisible();
    await expect(
      page.locator('a[href="/practice/kangaroo/grade-3/"]').first(),
    ).toBeVisible();
    await expect(
      page.locator('a[href="/kangaroo-2027/"]').first(),
    ).toBeVisible();
    const newsletterCta = page.locator('a[href="/newsletter/"]').first();
    await expect(newsletterCta).toBeVisible();
    await expect(newsletterCta).toContainText('free printable pack');
  });

  test('tools page links to the WA guide from the handy tools grid', async ({
    page,
  }) => {
    await page.goto('/tools');
    const card = page.locator('a[href="/kangaroo-2027-wa/"]');
    await expect(card).toBeVisible();
    await expect(card).toContainText('Washington Parent Guide');
  });

  test('national war room cross-links to the WA guide', async ({ page }) => {
    await page.goto('/kangaroo-2027/');
    const link = page.locator('a[href="/kangaroo-2027-wa/"]');
    await expect(link).toBeVisible();
    await expect(link).toContainText('Washington');
  });
});
