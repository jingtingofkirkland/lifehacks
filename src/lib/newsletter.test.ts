/**
 * Unit tests for the newsletter form-URL resolution.
 *
 * The page must never render a fake signup form: with no Tally URL
 * configured it shows a "coming soon" placeholder, and only a real
 * configured URL switches it to the embed.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { appendTallyParams, getNewsletterFormUrl } from './newsletter';

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

describe('appendTallyParams', () => {
  const EMBED =
    'https://tally.so/embed/J950MR?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1';

  it('adds hidden-field params alongside the existing embed params', () => {
    const url = new URL(
      appendTallyParams(EMBED, { score: '24/36', topics: 'Logic:F' }),
    );
    expect(url.searchParams.get('alignLeft')).toBe('1');
    expect(url.searchParams.get('dynamicHeight')).toBe('1');
    expect(url.searchParams.get('score')).toBe('24/36');
    expect(url.searchParams.get('topics')).toBe('Logic:F');
  });

  it('url-encodes values that contain spaces and punctuation', () => {
    const href = appendTallyParams(EMBED, {
      topics: 'Time & Money:S,Word Problems:G',
    });
    expect(href).not.toContain('Time & Money');
    expect(new URL(href).searchParams.get('topics')).toBe(
      'Time & Money:S,Word Problems:G',
    );
  });

  it('overrides a param instead of duplicating it', () => {
    const url = new URL(
      appendTallyParams(`${EMBED}&score=1%2F36`, { score: '30/36' }),
    );
    expect(url.searchParams.getAll('score')).toEqual(['30/36']);
  });
});
