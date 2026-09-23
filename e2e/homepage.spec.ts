import { test, expect } from '@playwright/test';

test('homepage loads with navigation into the tools section', async ({
  page,
}) => {
  await page.goto('/');

  // Page renders with a real title (not a blank/failed render).
  const title = await page.title();
  expect(title.trim().length).toBeGreaterThan(0);

  // The hero page links into /tools from the tools section's
  // "LEARN MORE" call-to-action.
  const toolsLink = page
    .locator('section#tools')
    .getByRole('link', { name: /learn more/i });
  await expect(toolsLink).toBeVisible();
  await toolsLink.click();
  await expect(page).toHaveURL(/\/tools\/?$/);
});
