/**
 * Unit tests for the newsletter form-URL resolution.
 *
 * The page must never render a fake signup form: with no Tally URL
 * configured it shows a "coming soon" placeholder, and only a real
 * configured URL switches it to the embed.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { getNewsletterFormUrl } from './newsletter';

const KEY = 'NEXT_PUBLIC_TALLY_FORM_URL';

describe('getNewsletterFormUrl', () => {
  afterEach(() => {
    delete process.env[KEY];
  });

  it('returns null when the env var is unset', () => {
    delete process.env[KEY];
    expect(getNewsletterFormUrl()).toBeNull();
  });

  it('returns null for a blank value', () => {
    process.env[KEY] = '   ';
    expect(getNewsletterFormUrl()).toBeNull();
  });

  it('returns the trimmed URL when configured', () => {
    process.env[KEY] = '  https://tally.so/r/abc123  ';
    expect(getNewsletterFormUrl()).toBe('https://tally.so/r/abc123');
  });
});
