import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();
const sitemap = readFileSync(path.join(root, 'public/sitemap.xml'), 'utf8');
const robots = readFileSync(path.join(root, 'public/robots.txt'), 'utf8');

describe('SEO files (public/robots.txt + public/sitemap.xml)', () => {
  it('robots.txt allows crawling and points at the sitemap', () => {
    expect(robots).toContain('User-agent: *');
    expect(robots).toContain('Allow: /');
    expect(robots).toContain('Sitemap: https://lifehacks.zeey-app.net/sitemap.xml');
  });

  it.each([
    '/',
    '/tools/education/',
    '/tools/kangaroo/',
    '/tools/kangaroo/readiness/',
    '/tools/math-addition/',
    '/tools/math-bubble-pop/',
    '/tools/math-bridge-builder/',
    '/tools/tip-calculator/',
    '/tools/draw-guess/',
    '/for-teachers/challenge-pack/',
    '/kangaroo-2027/cohort/',
    '/newsletter/',
  ])('sitemap includes %s', (url) => {
    expect(sitemap).toContain(`<loc>https://lifehacks.zeey-app.net${url}</loc>`);
  });

  it('sitemap excludes the legacy subscribe stub (noindex)', () => {
    expect(sitemap).not.toContain('<loc>https://lifehacks.zeey-app.net/subscribe/</loc>');
  });
});
