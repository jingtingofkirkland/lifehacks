/**
 * Meta Pixel event tracking helpers.
 *
 * The site loads the Meta Pixel (fbq, ID 337570375319394) in the root layout
 * on every page, where it fires a standard PageView. These helpers fire
 * lightweight custom events for the kids learning games so engagement is
 * visible in Events Manager.
 *
 * Every call is guarded twice:
 * 1. Hostname gate — the pixel only initializes and fires on the production
 *    host. Local dev, CI e2e, and preview deployments must never send
 *    analytics: test traffic once polluted the production dataset with
 *    1,276 localhost hits in 28 days, making engagement numbers unusable.
 *    Hostname (not NODE_ENV) is the check, because a local `next start`
 *    also runs in production mode.
 * 2. fbq presence — if the pixel is blocked (ad blockers) or not yet
 *    loaded, the event is silently dropped and the page/game never breaks.
 */

/**
 * The only hostname where the Meta Pixel may initialize and send events.
 */
export const PRODUCTION_HOSTNAME = 'lifehacks.zeey-app.net';

/**
 * Whether analytics may fire right now: true only on the production site.
 * Never throws; defaults to false when window/location is unavailable.
 */
export function isPixelEnabled(): boolean {
  try {
    return (
      typeof window !== 'undefined' &&
      typeof window.location !== 'undefined' &&
      window.location.hostname === PRODUCTION_HOSTNAME
    );
  } catch {
    return false;
  }
}

/** Fire a Meta Pixel custom event. Safe to call when fbq is missing. */
export function trackEvent(
  name: string,
  params?: Record<string, string | number | boolean>,
): void {
  try {
    if (!isPixelEnabled()) return;
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
 * Pages whose first full open fires the AdLanding custom event.
 *
 * layout.tsx inlines this list (JSON.stringify) and
 * PIXEL_PAGE_NAME_SNIPPET into the root layout's pixel script, so the
 * shipped script runs exactly the code unit-tested here. Never re-declare
 * getPageName or AD_LANDING_PAGES inside layout.tsx by hand.
 */
export const AD_LANDING_PAGES = ['tools/education'];

/**
 * Plain-JS page-name helper for the root layout's pixel script.
 *
 * The script tag in layout.tsx cannot import modules, so this function
 * ships as an interpolated string (same pattern as PIXEL_TRACK_SNIPPET
 * for the game blobs). Keep it free of backticks and ${} sequences, or
 * it will break the surrounding template literal.
 *
 * Regression (2026-11-04): this regex once lacked the /g flag, so only
 * the leading slash was stripped: '/tools/education/' came out as
 * 'tools/education/', never matched AD_LANDING_PAGES, and silently
 * killed the AdLanding event for three days. The tests execute this
 * exact string against the production URLs, so a recurrence fails CI
 * instead of failing silently in production.
 */
export const PIXEL_PAGE_NAME_SNIPPET = `
function getPageName() {
  try {
    if (typeof window === 'undefined' || typeof window.location === 'undefined') return 'home';
    var path = window.location.pathname.replace(/^\\/|\\/$/g, '');
    return path || 'home';
  } catch (e) {
    return 'home';
  }
}
`;

/**
 * Plain-JS twin of trackEvent for the self-contained game blobs
 * (tool-content.ts), whose injected scripts cannot import modules at runtime.
 * Interpolated into MATH_TOOL_JS at build time, so keep it free of backticks
 * and ${} sequences. The production hostname is inlined here; keep it in
 * sync with PRODUCTION_HOSTNAME above.
 */
export const PIXEL_TRACK_SNIPPET = `
function trackPixelEvent(name, params) {
  try {
    if (typeof window !== 'undefined' && window.location.hostname === 'lifehacks.zeey-app.net' && typeof window.fbq === 'function') {
      window.fbq('trackCustom', name, params || {});
    }
  } catch (e) {
    /* Meta Pixel blocked or unavailable - analytics must never break the game. */
  }
}
`;
