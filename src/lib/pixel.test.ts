// @vitest-environment jsdom
/**
 * Unit tests for the Meta Pixel event helpers (src/lib/pixel.ts).
 *
 * The helpers must never throw: ad blockers and privacy tools routinely
 * remove or break window.fbq, and analytics must never break the page.
 *
 * They must also stay silent outside production: test traffic once
 * polluted the production dataset, so every helper is gated on
 * window.location.hostname === 'lifehacks.zeey-app.net'.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  PIXEL_TRACK_SNIPPET,
  PRODUCTION_HOSTNAME,
  isPixelEnabled,
  trackEvent,
} from './pixel';

/** jsdom's window.location is read-only; redefine it to fake the host. */
function setHostname(hostname: string) {
  Object.defineProperty(window, 'location', {
    configurable: true,
    writable: true,
    value: { hostname },
  });
}

describe('isPixelEnabled', () => {
  it('is true only on the production hostname', () => {
    setHostname(PRODUCTION_HOSTNAME);
    expect(isPixelEnabled()).toBe(true);
  });

  it.each(['localhost', '127.0.0.1', 'preview.example.com', ''])(
    'is false on non-production hostname %s',
    (hostname) => {
      setHostname(hostname);
      expect(isPixelEnabled()).toBe(false);
    },
  );

  it('never throws when window is unavailable', () => {
    expect(() => isPixelEnabled()).not.toThrow();
  });
});

describe('trackEvent', () => {
  const w = window as unknown as { fbq?: unknown };
  const originalFbq = w.fbq;

  afterEach(() => {
    w.fbq = originalFbq;
    setHostname('localhost');
    vi.restoreAllMocks();
  });

  it('does nothing (and does not throw) when fbq is missing', () => {
    setHostname(PRODUCTION_HOSTNAME);
    w.fbq = undefined;
    expect(() =>
      trackEvent('GameStarted', { game: 'merge_racer' }),
    ).not.toThrow();
  });

  it('forwards the event to fbq as a trackCustom call on production', () => {
    setHostname(PRODUCTION_HOSTNAME);
    const fbq = vi.fn();
    w.fbq = fbq;
    trackEvent('GameStarted', { game: 'merge_racer' });
    expect(fbq).toHaveBeenCalledTimes(1);
    expect(fbq).toHaveBeenCalledWith('trackCustom', 'GameStarted', {
      game: 'merge_racer',
    });
  });

  it('defaults params to an empty object', () => {
    setHostname(PRODUCTION_HOSTNAME);
    const fbq = vi.fn();
    w.fbq = fbq;
    trackEvent('GameCardClick');
    expect(fbq).toHaveBeenCalledWith('trackCustom', 'GameCardClick', {});
  });

  it('never throws when fbq itself throws (e.g. blocked mid-flight)', () => {
    setHostname(PRODUCTION_HOSTNAME);
    w.fbq = () => {
      throw new Error('blocked');
    };
    expect(() => trackEvent('GameStarted', { game: 'x' })).not.toThrow();
  });

  it.each(['localhost', '127.0.0.1', 'preview.example.com'])(
    'stays silent on non-production hostname %s even when fbq exists',
    (hostname) => {
      setHostname(hostname);
      const fbq = vi.fn();
      w.fbq = fbq;
      expect(() =>
        trackEvent('GameStarted', { game: 'merge_racer' }),
      ).not.toThrow();
      expect(fbq).not.toHaveBeenCalled();
    },
  );
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

  it('gates on the production hostname before touching fbq', () => {
    expect(PIXEL_TRACK_SNIPPET).toContain(
      "window.location.hostname === 'lifehacks.zeey-app.net'",
    );
  });
});
