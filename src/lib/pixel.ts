/**
 * Meta Pixel event tracking helpers.
 *
 * The site loads the Meta Pixel (fbq, ID 337570375319394) in the root layout
 * on every page, where it fires a standard PageView. These helpers fire
 * lightweight custom events for the kids learning games so engagement is
 * visible in Events Manager.
 *
 * Every call is guarded: if the pixel is blocked (ad blockers) or not yet
 * loaded, the event is silently dropped and the page/game never breaks.
 */

/** Fire a Meta Pixel custom event. Safe to call when fbq is missing. */
export function trackEvent(
  name: string,
  params?: Record<string, string | number | boolean>,
): void {
  try {
    const w = window as unknown as { fbq?: unknown };
    if (typeof w.fbq === 'function') {
      (w.fbq as (...args: unknown[]) => void)(
        'trackCustom',
        name,
        params ?? {},
      );
    }
  } catch {
    // Meta Pixel blocked or unavailable — analytics must never break the page.
  }
}

/**
 * Plain-JS twin of trackEvent for the self-contained game blobs
 * (tool-content.ts), whose injected scripts cannot import modules at runtime.
 * Interpolated into MATH_TOOL_JS at build time, so keep it free of backticks
 * and ${} sequences.
 */
export const PIXEL_TRACK_SNIPPET = `
function trackPixelEvent(name, params) {
  try {
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      window.fbq('trackCustom', name, params || {});
    }
  } catch (e) {
    /* Meta Pixel blocked or unavailable - analytics must never break the game. */
  }
}
`;
