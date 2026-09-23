/**
 * Unit tests for src/lib/posts.ts.
 *
 * Posts are read from data/posts at build time. These tests guard the
 * error-handling contract: a missing file must resolve to null / be skipped,
 * never throw and break a page build.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getAllPostContents, getPostContent } from './posts';

describe('posts lib', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('reads a real post file from data/posts', async () => {
    const content = await getPostContent('transformer-architecture.md');

    expect(typeof content).toBe('string');
    expect((content as string).length).toBeGreaterThan(0);
  });

  it('returns null for a missing post file instead of throwing', async () => {
    await expect(
      getPostContent('definitely-not-a-real-post.md'),
    ).resolves.toBeNull();
  });

  it('skips missing files when loading many posts', async () => {
    const contents = await getAllPostContents([
      'transformer-architecture.md',
      'definitely-not-a-real-post.md',
    ]);

    expect(Object.keys(contents)).toEqual(['transformer-architecture.md']);
  });

  it('returns an empty record for an empty input list', async () => {
    await expect(getAllPostContents([])).resolves.toEqual({});
  });
});
