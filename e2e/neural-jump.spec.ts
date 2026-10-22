import { test, expect } from '@playwright/test';

/**
 * /tech/neural-network-learns-to-jump/ — the playable neural-network
 * article. The demo is the space-3 toy embedded verbatim (canvas HUD,
 * 120px default platform width, no halo / leader markers); these tests
 * pin the page contract: the demo mounts with all controls, training
 * actually advances generations, and the bilingual explainer (including
 * the genetic-algorithm vs. backpropagation section) is reachable.
 */
test.describe('neural network learns to jump article page', () => {
  test('demo mounts with controls, HUD-era stat boxes and 120px default width', async ({
    page,
  }) => {
    await page.goto('/tech/neural-network-learns-to-jump/');

    await expect(page).toHaveTitle(/neural network learns to jump stairs/i);

    const demo = page.getByTestId('nnj-demo');
    await expect(demo).toBeVisible();

    // All of the toy's controls survive the embedding.
    await expect(demo.getByRole('button', { name: /开始训练/ })).toBeVisible();
    await expect(demo.getByRole('button', { name: /暂停/ })).toBeVisible();
    await expect(demo.getByRole('button', { name: /重新随机开始/ })).toBeVisible();
    await expect(demo.getByRole('button', { name: /最佳个体演示/ })).toBeVisible();
    await expect(demo.getByRole('button', { name: /挪动台阶/ })).toBeVisible();

    // Game + brain + chart canvases all render.
    await expect(demo.locator('canvas#game')).toBeVisible();
    await expect(demo.locator('canvas#nn')).toBeVisible();
    await expect(demo.locator('canvas#chart')).toBeVisible();

    // Final-version defaults: platform width slider at 120px, hidden layer 6.
    await expect(demo.locator('#rWid')).toHaveValue('120');
    await expect(demo.locator('#oWid')).toHaveText('120px');
    await expect(demo.locator('#selHid')).toHaveValue('6');

    // Stat strip that mirrors the canvas HUD.
    await expect(demo.locator('#sGen')).toHaveText(/第 1 代/);
    await expect(demo.locator('#sSucc')).toBeVisible();
  });

  test('training advances generations and paints the game canvas', async ({
    page,
  }) => {
    await page.goto('/tech/neural-network-learns-to-jump/');
    const demo = page.getByTestId('nnj-demo');

    // The game canvas is actually being drawn on (platforms + figures).
    const painted = await demo.locator('canvas#game').evaluate((c) => {
      const el = c as HTMLCanvasElement;
      const ctx = el.getContext('2d');
      if (!ctx) return 0;
      const data = ctx.getImageData(0, 0, el.width, el.height).data;
      let n = 0;
      for (let i = 3; i < data.length; i += 4) if (data[i] > 0) n += 1;
      return n;
    });
    expect(painted).toBeGreaterThan(1000);

    await demo.getByRole('button', { name: /开始训练/ }).click();

    // Generations tick over (whole population is evaluated in parallel).
    await expect(demo.locator('#sGen')).not.toHaveText(/第 1 代/, {
      timeout: 60_000,
    });
  });

  test('article renders in English with the GA vs backpropagation section, and toggles to Chinese', async ({
    page,
  }) => {
    await page.goto('/tech/neural-network-learns-to-jump/');

    await expect(
      page.getByRole('heading', {
        name: /why not backpropagation/i,
      }),
    ).toBeVisible();
    await expect(page.getByText(/no gradient exists to descend/i)).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /one output, three jobs/i }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /shaping without traps/i }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /learned a skill, not a route/i }),
    ).toBeVisible();

    await page.getByRole('button', { name: '中文' }).click();
    await expect(
      page.getByRole('heading', { name: /为什么不用反向传播/ }),
    ).toBeVisible();
    await expect(page.getByText(/没有梯度，就无从下降/)).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /一个输出，身兼三职/ }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /塑形不挖坑/ }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /学的是技能，不是路线/ }),
    ).toBeVisible();
  });

  test('/tech/ list card links straight to the article page', async ({
    page,
  }) => {
    await page.goto('/tech/');
    const cardLink = page.getByRole('link', {
      name: /play the demo & read the article/i,
    });
    await expect(cardLink).toBeVisible();
    await expect(cardLink).toHaveAttribute(
      'href',
      '/tech/neural-network-learns-to-jump/',
    );
  });
});
