import { test, expect } from '@playwright/test';

/**
 * Newsletter signup MVP (/newsletter/): hero copy, "what's inside",
 * the coming-soon placeholder (no Tally URL is configured yet), the
 * sitemap entry, and the CTA card on the Kangaroo hub page.
 */
test.describe('newsletter signup', () => {
  test('newsletter page renders hero, whats-inside and placeholder', async ({
    page,
  }) => {
    await page.goto('/newsletter/');

    await expect(
      page.getByRole('heading', { name: 'Weekly Math Worksheet Newsletter' }),
    ).toBeVisible();
    await expect(page.getByText(/One email every Friday/)).toBeVisible();

    await expect(
      page.getByText(/This week's best problems/),
    ).toBeVisible();
    await expect(page.getByText(/Printable worksheet/)).toBeVisible();
    await expect(page.getByText(/Next week preview/)).toBeVisible();
    await expect(page.getByText(/Kangaroo countdown series/)).toBeVisible();

    // No Tally URL configured -> honest placeholder, never a fake form.
    await expect(page.getByTestId('newsletter-placeholder')).toBeVisible();
    await expect(page.getByTestId('newsletter-placeholder')).toContainText(
      /Subscription opens soon/,
    );
    await expect(page.getByTestId('newsletter-form')).toHaveCount(0);
  });

  test('kangaroo hub links to the newsletter page', async ({ page }) => {
    await page.goto('/tools/kangaroo/');
    await expect(
      page.getByText(/Get the weekly worksheet by email/),
    ).toBeVisible();
    const cta = page.locator('a[href="/newsletter/"]');
    await expect(cta.first()).toBeVisible();
    await expect(cta.first()).toContainText(/Subscribe free/);
  });

  test('sitemap includes the newsletter page', async ({ request }) => {
    const res = await request.get('/sitemap.xml');
    expect(res.ok()).toBeTruthy();
    const xml = await res.text();
    expect(xml).toContain('https://lifehacks.zeey-app.net/newsletter/');
  });
});
