import { test, expect } from '@playwright/test';

test('homepage routes visitors to the flagship tools and newsletter', async ({
  page,
}) => {
  await page.goto('/');

  // <title> carries the search keywords (brand + offer)…
  const title = await page.title();
  expect(title).toMatch(/great seattle life hacks/i);
  expect(title).toMatch(/free math practice/i);

  // …while the single H1 carries the brand (v3 correction: the site is
  // Life Hacks first; education is the biggest block, not the identity).
  const h1 = page.locator('h1');
  await expect(h1).toHaveCount(1);
  await expect(h1).toHaveText(/great seattle life hacks/i);

  // The education block has its own H2 carrying the math positioning.
  const eduHeading = page.getByRole('heading', {
    name: /math practice & games for elementary kids/i,
  });
  await expect(eduHeading).toBeVisible();

  // Primary CTA goes straight to the readiness check.
  const primaryCta = page
    .getByRole('link', {
      name: /readiness check/i,
    })
    .first();
  await expect(primaryCta).toBeVisible();
  await expect(primaryCta).toHaveAttribute(
    'href',
    '/tools/kangaroo/readiness/',
  );

  // The router grid links into the education games hub.
  const gamesCard = page.getByRole('link', { name: /play the games/i });
  await expect(gamesCard).toBeVisible();
  await gamesCard.click();
  await expect(page).toHaveURL(/\/tools\/education\/?$/);
});

test('homepage embeds the newsletter signup form', async ({ page }) => {
  await page.goto('/');
  // Same Tally embed as /newsletter/ (or its honest placeholder while no
  // form URL is configured) — never a fake form.
  const form = page.getByTestId('newsletter-form');
  const placeholder = page.getByTestId('newsletter-placeholder');
  await expect(form.or(placeholder)).toBeVisible();
});

test('homepage shows the three sibling section blocks with direct links', async ({
  page,
}) => {
  await page.goto('/');

  // Space / AI / Life Saver Tools are proper section blocks below the
  // education block: heading + button, one click straight into the section.
  const sections = [
    { name: /explore space tech/i, href: '/space/' },
    { name: /explore ai techs/i, href: '/tech/' },
    { name: /explore life saver tools/i, href: '/tools/' },
  ];
  for (const section of sections) {
    const block = page.getByRole('link', { name: section.name });
    await expect(block).toBeVisible();
    await expect(block).toHaveAttribute('href', section.href);
  }
});
