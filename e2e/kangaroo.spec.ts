import { test, expect } from '@playwright/test';

/**
 * Math Kangaroo prep MVP (/tools/kangaroo/): daily challenge, timed quiz,
 * printable worksheet, and the Education landing card that links here.
 */
test.describe('kangaroo prep', () => {
  test('page loads with header, tabs and originality disclaimer', async ({
    page,
  }) => {
    await page.goto('/tools/kangaroo/');
    await expect(
      page.getByRole('heading', { name: 'Math Kangaroo Prep' }),
    ).toBeVisible();
    await expect(page.getByTestId('kq-tab-daily')).toBeVisible();
    await expect(page.getByTestId('kq-tab-quiz')).toBeVisible();
    await expect(page.getByTestId('kq-tab-worksheet')).toBeVisible();
    // Honest labeling: original problems, not past contest questions.
    await expect(
      page.getByText(/not past contest questions/i),
    ).toBeVisible();
  });

  test('daily challenge shows a 5-choice problem and explains the answer', async ({
    page,
  }) => {
    await page.goto('/tools/kangaroo/');
    await expect(
      page.getByRole('heading', { name: "Today's Challenge" }),
    ).toBeVisible();
    const choices = page.locator('[role="group"][aria-label="Answer choices"] button');
    await expect(choices).toHaveCount(5);
    await choices.first().click();
    // After answering, an explanation panel appears.
    await expect(page.getByText(/Correct!|Not quite/i).first()).toBeVisible();
  });

  test('timed quiz runs end-to-end and shows a scored review', async ({
    page,
  }) => {
    await page.goto('/tools/kangaroo/');
    await page.getByTestId('kq-tab-quiz').click();
    await page.getByTestId('kq-quiz-start').click();
    await expect(page.getByTestId('kq-quiz-timer')).toBeVisible();

    // Answer all 8 questions (auto-advances after each pick).
    for (let i = 0; i < 8; i++) {
      const card = page.getByTestId('kq-quiz-question');
      await expect(card).toBeVisible();
      await card.locator('[role="group"] button').first().click();
      // Brief pause for the auto-advance; last question lands on results.
      await page.waitForTimeout(700);
    }

    await expect(page.getByText('Quiz complete!')).toBeVisible();
    await expect(page.getByTestId('kq-quiz-review')).toBeVisible();
    // Review covers every question.
    await expect(
      page.getByTestId('kq-quiz-review').locator('div.rounded-xl'),
    ).toHaveCount(8);
  });

  test('quiz completion shows a score card download and newsletter CTA', async ({
    page,
  }) => {
    await page.goto('/tools/kangaroo/');
    await page.getByTestId('kq-tab-quiz').click();
    await page.getByTestId('kq-quiz-start').click();

    // Answer all 8 questions (auto-advances after each pick).
    for (let i = 0; i < 8; i++) {
      const card = page.getByTestId('kq-quiz-question');
      await expect(card).toBeVisible();
      await card.locator('[role="group"] button').first().click();
      // Brief pause for the auto-advance; last question lands on results.
      await page.waitForTimeout(700);
    }

    await expect(page.getByText('Quiz complete!')).toBeVisible();
    // Score share card renders with a one-tap PNG download...
    await expect(page.getByTestId('kq-score-card-canvas')).toBeVisible();
    await expect(page.getByTestId('kq-score-card-download')).toBeVisible();
    // ...and the completion state carries its own newsletter CTA.
    const cta = page.getByTestId('kq-quiz-newsletter-cta');
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', '/newsletter/');
    await expect(
      page.getByText('Get a free worksheet every week').first(),
    ).toBeVisible();
  });

  test('worksheet tab offers a print button and an answer key', async ({
    page,
  }) => {
    await page.goto('/tools/kangaroo/');
    await page.getByTestId('kq-tab-worksheet').click();
    await expect(page.getByTestId('kq-worksheet-print')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Answer Key' }),
    ).toBeVisible();
  });

  test('education page links to the kangaroo hub via a game card', async ({
    page,
  }) => {
    await page.goto('/tools/education/');
    const card = page.locator('a[href="/tools/kangaroo/"]');
    await expect(card).toBeVisible();
    await expect(card).toContainText('Math Kangaroo Prep');
  });
});
