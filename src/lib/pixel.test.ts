// @vitest-environment jsdom
/**
 * Unit tests for the Meta Pixel event helpers (src/lib/pixel.ts).
 *
 * The helpers must never throw: ad blockers and privacy tools routinely
 * remove or break window.fbq, and analytics must never break the page.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PIXEL_TRACK_SNIPPET, trackEvent } from './pixel';

describe('trackEvent', () => {
  const w = window as unknown as { fbq?: unknown };
  const originalFbq = w.fbq;

  afterEach(() => {
    w.fbq = originalFbq;
    vi.restoreAllMocks();
  });

  it('does nothing (and does not throw) when fbq is missing', () => {
    w.fbq = undefined;
    expect(() =>
      trackEvent('GameStarted', { game: 'merge_racer' }),
    ).not.toThrow();
  });

  it('forwards the event to fbq as a trackCustom call', () => {
    const fbq = vi.fn();
    w.fbq = fbq;
    trackEvent('GameStarted', { game: 'merge_racer' });
    expect(fbq).toHaveBeenCalledTimes(1);
    expect(fbq).toHaveBeenCalledWith('trackCustom', 'GameStarted', {
      game: 'merge_racer',
    });
  });

  it('defaults params to an empty object', () => {
    const fbq = vi.fn();
    w.fbq = fbq;
    trackEvent('GameCardClick');
    expect(fbq).toHaveBeenCalledWith('trackCustom', 'GameCardClick', {});
  });

  it('never throws when fbq itself throws (e.g. blocked mid-flight)', () => {
    w.fbq = () => {
      throw new Error('blocked');
    };
    expect(() => trackEvent('GameStarted', { game: 'x' })).not.toThrow();
  });
});

describe('PIXEL_TRACK_SNIPPET', () => {
  it('defines the trackPixelEvent helper used by the game blobs', () => {
    expect(PIXEL_TRACK_SNIPPET).toContain('function trackPixelEvent');
    expect(PIXEL_TRACK_SNIPPET).toContain("fbq('trackCustom'");
  });

  it('is safe to interpolate into the MATH_TOOL_JS template literals', () => {
    // Backticks or ${} would break the surrounding template literal.
    expect(PIXEL_TRACK_SNIPPET).not.toContain('`');
    expect(PIXEL_TRACK_SNIPPET).not.toContain('${');
  });
});
