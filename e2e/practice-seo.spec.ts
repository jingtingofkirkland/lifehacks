import { test, expect } from '@playwright/test';

/**
 * Practice-problem SEO pages (/practice/kangaroo/grade-3|4/<slug>/):
 * index lists, interactive leaf pages, and the Google Practice-problems
 * Quiz JSON-LD on every leaf page.
 */
test.describe('practice seo pages', () => {
  test('grade-3 index lists 16 problems, grade-4 lists 24', async ({
    page,
  }) => {
    await page.goto('/practice/kangaroo/grade-3/');
    await expect(
      page.getByRole('heading', { name: 'Grade 3 Math Kangaroo Practice Problems' }),
    ).toBeVisible();
    await expect(
      page.locator('a[href^="/practice/kangaroo/grade-3/"]'),
    ).toHaveCount(16);

    await page.goto('/practice/kangaroo/grade-4/');
    await expect(
      page.getByRole('heading', { name: 'Grade 4 Math Kangaroo Practice Problems' }),
    ).toBeVisible();
    await expect(
      page.locator('a[href^="/practice/kangaroo/grade-4/"]'),
    ).toHaveCount(24);
  });

  test('leaf page is interactive: pick an option, explanation appears', async ({
    page,
  }) => {
    await page.goto('/practice/kangaroo/grade-3/maya-stickers-addition/');
    await expect(
      page.getByRole('heading', { name: "Maya's Stickers" }),
    ).toBeVisible();

    // Answer stays hidden until interaction (no-spoiler pattern).
    await expect(page.getByTestId('practice-explanation')).toHaveCount(0);

    const options = page.getByTestId('practice-option');
    await expect(options).toHaveCount(5);
    await options.first().click();

    await expect(page.getByTestId('practice-explanation')).toBeVisible();
    await expect(page.getByText(/Correct!|Not quite/i).first()).toBeVisible();
  });

  test('leaf page carries Quiz JSON-LD with the full answer set', async ({
    page,
  }) => {
    await page.goto('/practice/kangaroo/grade-4/snail-climbs-wall/');
    const ldJson = await page
      .locator('script[type="application/ld+json"]')
      .first()
      .innerText();
    const data = JSON.parse(ldJson);
    expect(data['@type']).toBe('Quiz');
    expect(data.hasPart['@type']).toBe('Question');
    expect(data.hasPart.eduQuestionType).toBe('Multiple choice');
    expect(data.hasPart.learningResourceType).toBe('Practice problem');
    expect(data.hasPart.text).toContain('snail');
    expect(data.hasPart.suggestedAnswer).toHaveLength(4);
    expect(data.hasPart.acceptedAnswer.answerExplanation.text.length).toBeGreaterThan(
      0,
    );
  });

  test('kangaroo hub links to both practice indexes', async ({ page }) => {
    await page.goto('/tools/kangaroo/');
    await expect(page.getByRole('link', { name: /Grade 3 problems/ })).toHaveAttribute(
      'href',
      '/practice/kangaroo/grade-3/',
    );
    await expect(page.getByRole('link', { name: /Grade 4 problems/ })).toHaveAttribute(
      'href',
      '/practice/kangaroo/grade-4/',
    );
  });
});
