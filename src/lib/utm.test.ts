/**
 * Unit tests for src/lib/utm.ts.
 *
 * UTM params are captured into sessionStorage so outbound/share links keep
 * attribution. Guards: valid JSON round-trips, missing key -> {}, and
 * corrupt JSON never throws (a single bad value must not break the page).
 */
// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { getStoredUtm } from './utm';

describe('getStoredUtm', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('returns the stored UTM params', () => {
    sessionStorage.setItem(
      'utm',
      JSON.stringify({ source: 'newsletter', campaign: 'spring' }),
    );

    expect(getStoredUtm()).toEqual({ source: 'newsletter', campaign: 'spring' });
  });

  it('returns {} when nothing is stored', () => {
    expect(getStoredUtm()).toEqual({});
  });

  it('returns {} on corrupt JSON instead of throwing', () => {
    sessionStorage.setItem('utm', '{not-valid-json');

    expect(getStoredUtm()).toEqual({});
  });
});
