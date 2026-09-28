import { test, expect } from '@playwright/test';

/**
 * The embed variant of Merge Racer (`/embed/math-addition/`) is the page
 * partner sites iframe. It must render the game with only a slim
 * attribution bar — no site navigation or floating widgets.
 */
test('embed page renders the game chromeless with attribution', async ({
  page,
}) => {
  await page.goto('/embed/math-addition/');

  await expect(page).toHaveTitle(/merge racer/i);

  // The game mounts into the embed shell.
  const mount = page.locator('[data-testid="embed-game-mount"]');
  await expect(mount.locator('div').first()).toBeVisible();

  // Slim "Powered by LifeHacks" attribution bar links back to the site.
  const attribution = page.getByRole('link', { name: 'LifeHacks' });
  await expect(attribution).toBeVisible();
  await expect(attribution).toHaveAttribute(
    'href',
    /lifehacks\.zeey-app\.net/,
  );

  // No floating site chrome inside the embed.
  await expect(
    page.locator('[data-testid="messenger-bubble-wrap"]'),
  ).toHaveCount(0);
  await expect(page.locator('[data-testid="feedback-desktop"]')).toHaveCount(
    0,
  );
  await expect(page.locator('[data-testid="feedback-mobile"]')).toHaveCount(0);
  await expect(
    page.getByRole('button', { name: /toggle theme/i }),
  ).toHaveCount(0);

  // No "Back to Tools" site navigation on the embed page.
  await expect(page.getByRole('link', { name: /back to tools/i })).toHaveCount(
    0,
  );
});
