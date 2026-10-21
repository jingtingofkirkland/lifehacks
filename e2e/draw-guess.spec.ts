import { test, expect } from '@playwright/test';

test('draw & guess: full pass-and-play round with anti-peek masking', async ({
  page,
}) => {
  await page.goto('/tools/draw-guess/');

  await expect(
    page.getByRole('heading', { name: /draw & guess/i }),
  ).toBeVisible();

  // Draw a word: the peek card shows only a mask, never the word itself.
  await page.getByTestId('draw-word-btn').click();
  const peek = page.getByTestId('peek-area');
  await expect(peek).toBeVisible();
  await expect(page.getByTestId('word-masked')).toContainText('•');
  await expect(page.getByTestId('word-text')).toHaveCount(0);

  // Hold to peek: word appears only while holding, release re-masks.
  const box = await peek.boundingBox();
  if (!box) throw new Error('peek area has no bounding box');
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await expect(page.getByTestId('word-text')).toBeVisible();
  await page.mouse.up();
  await expect(page.getByTestId('word-text')).toHaveCount(0);
  await expect(page.getByTestId('word-masked')).toBeVisible();

  // Start drawing: canvas appears, word strip stays masked.
  await page.getByTestId('start-draw-btn').click();
  const canvas = page.getByTestId('draw-canvas');
  await expect(canvas).toBeVisible();
  await expect(page.getByTestId('timer-display')).toBeVisible();
  await expect(page.getByTestId('word-masked')).toBeVisible();
  await expect(page.getByTestId('word-text')).toHaveCount(0);

  // Draw a stroke: undo becomes available once a stroke lands.
  const cbox = await canvas.boundingBox();
  if (!cbox) throw new Error('canvas has no bounding box');
  await page.mouse.move(cbox.x + 40, cbox.y + 40);
  await page.mouse.down();
  await page.mouse.move(cbox.x + 140, cbox.y + 120, { steps: 8 });
  await page.mouse.up();
  await expect(page.getByTestId('undo-btn')).toBeEnabled();

  // Reveal: the word is finally shown in plain text.
  await page.getByTestId('reveal-btn').click();
  await expect(page.getByTestId('reveal-word')).toBeVisible();
  await expect(page.getByTestId('reveal-word')).not.toBeEmpty();

  // Manual tally +1, then next round returns to a masked peek card.
  await page.getByTestId('tally-plus-btn').click();
  await expect(page.getByText(/Tally:/)).toContainText('1');
  await page.getByTestId('next-round-btn').click();
  await expect(page.getByTestId('peek-area')).toBeVisible();
  await expect(page.getByTestId('word-text')).toHaveCount(0);
});

test('tools index lists the draw & guess game', async ({ page }) => {
  await page.goto('/tools/');
  const card = page.getByRole('link', { name: /draw & guess/i });
  await expect(card).toBeVisible();
  await expect(card).toHaveAttribute('href', '/tools/draw-guess/');
});
