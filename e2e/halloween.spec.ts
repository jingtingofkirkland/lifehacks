import { expect, test } from '@playwright/test';

/** Correct option index for each online problem (see questions.ts key). */
const ANSWERS: Array<[string, number]> = [
  ['hw-01', 2],
  ['hw-03', 1],
  ['hw-05', 2],
  ['hw-08', 0],
  ['hw-10', 3],
  ['hw-12', 0],
];

test.describe('Halloween Math Hunt', () => {
  test('page shows the online hunt, the printable pack and the answer key', async ({
    page,
  }) => {
    await page.goto('/tools/halloween-math/');

    await expect(
      page.getByRole('heading', { name: 'Halloween Math Hunt' }),
    ).toBeVisible();

    // Six online problems.
    for (const [id] of ANSWERS) {
      await expect(page.getByTestId(`hw-question-${id}`)).toBeVisible();
    }

    // Printable pack: all 12 problems, including print-only ones, and the
    // answer key with the subscribe / readiness / stencils lines.
    await expect(page.getByTestId('hw-print')).toBeVisible();
    await expect(page.getByText(/bonus problems are print-only/i)).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Answer Key' })).toBeVisible();
    await expect(
      page.getByText(/lifehacks\.zeey-app\.net\/newsletter\//),
    ).toBeVisible();
    await expect(
      page.getByText(/tools\/kangaroo\/readiness\//),
    ).toBeVisible();

    // Shared subscribe card + cross-links.
    await expect(page.getByTestId('subscribe-cta')).toBeVisible();
    await expect(page.getByTestId('hw-link-stencils')).toHaveAttribute(
      'href',
      '/halloween/pumpkin-stencils/',
    );
    await expect(page.getByTestId('hw-link-readiness')).toHaveAttribute(
      'href',
      '/tools/kangaroo/readiness/',
    );
  });

  test('answering all 6 online problems shows the final score', async ({
    page,
  }) => {
    await page.goto('/tools/halloween-math/');

    for (const [id, answerIdx] of ANSWERS) {
      const section = page.getByTestId(`hw-question-${id}`);
      await section.locator('[role="group"] button').nth(answerIdx).click();
      await expect(section.getByText(/Correct! Nice work/)).toBeVisible();
    }

    const score = page.getByTestId('hw-hunt-score');
    await expect(score).toBeVisible();
    await expect(score).toContainText('24 of 24 points');
  });

  test('tools index cards the hunt next to the pumpkin stencils', async ({
    page,
  }) => {
    await page.goto('/tools/');
    const card = page.getByRole('link', { name: /halloween math hunt/i });
    await expect(card).toBeVisible();
    await expect(card).toHaveAttribute('href', '/tools/halloween-math/');
  });

  test('pumpkin stencils page links to the hunt', async ({ page }) => {
    await page.goto('/halloween/pumpkin-stencils/');
    const link = page.getByRole('link', { name: /halloween math hunt/i });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', '/tools/halloween-math/');
  });
});
