/**
 * Engagement tracking logic (dwell time, scroll depth, pages per session).
 *
 * Pure, DOM-free helpers live here so they are unit-testable. The
 * browser wiring lives in src/components/EngagementTracker.tsx, which sends
 * everything through src/lib/pixel.ts trackEvent — so events only ever fire
 * on the production hostname and a blocked pixel can never break the page.
 */

/** Visible-time thresholds (seconds) and their Pixel custom event names. */
export const DWELL_THRESHOLDS = [10, 30, 60, 120] as const;
export const DWELL_EVENT_NAMES = [
  'Dwell10s',
  'Dwell30s',
  'Dwell60s',
  'Dwell120s',
] as const;

/** Scroll milestones (percent of page seen) and their event names. */
export const SCROLL_MILESTONES = [25, 50, 75, 90] as const;
export const SCROLL_EVENT_NAMES = [
  'Scroll25',
  'Scroll50',
  'Scroll75',
  'Scroll90',
] as const;

/** Event fired once per session when the visitor opens a second page. */
export const SECOND_PAGE_VIEW_EVENT = 'SecondPageView';

/** sessionStorage key for the per-session page view counter. */
export const SESSION_PAGE_VIEWS_KEY = 'engagement_page_views';

/**
 * Dwell event names whose threshold has been reached by the accumulated
 * *visible* time (seconds). The tracker fires each name at most once per
 * page view.
 */
export function reachedDwellEvents(visibleSeconds: number): string[] {
  const out: string[] = [];
  for (let i = 0; i < DWELL_THRESHOLDS.length; i++) {
    if (visibleSeconds >= DWELL_THRESHOLDS[i]) {
      out.push(DWELL_EVENT_NAMES[i]);
    }
  }
  return out;
}

/**
 * Percent of the page the visitor has seen (0–100), measured by how far the
 * bottom edge of the viewport has travelled. Returns 100 when the whole
 * page fits on one screen (nothing to scroll).
 */
export function scrollDepthPercent(
  scrollY: number,
  viewportHeight: number,
  documentHeight: number,
): number {
  if (!(viewportHeight > 0) || !(documentHeight > 0)) return 0;
  if (documentHeight <= viewportHeight) return 100;
  const seen = (scrollY + viewportHeight) / documentHeight;
  return Math.min(100, Math.max(0, seen * 100));
}

/**
 * Scroll event names whose milestone has been reached by depthPercent.
 * The tracker fires each name at most once per page view.
 */
export function reachedScrollEvents(depthPercent: number): string[] {
  const out: string[] = [];
  for (let i = 0; i < SCROLL_MILESTONES.length; i++) {
    if (depthPercent >= SCROLL_MILESTONES[i]) {
      out.push(SCROLL_EVENT_NAMES[i]);
    }
  }
  return out;
}

/**
 * Advance the per-session page view counter. `raw` is the previously stored
 * value (null when absent); missing or garbage input counts as 0.
 * Returns the new count and whether this page view is the session's second
 * (the moment SecondPageView should fire, once per session).
 */
export function incrementPageViewCount(raw: string | null): {
  count: number;
  isSecond: boolean;
} {
  const parsed = raw == null ? NaN : parseInt(raw, 10);
  const prev =
    Number.isFinite(parsed) && (parsed as number) > 0
      ? Math.floor(parsed as number)
      : 0;
  const count = prev + 1;
  return { count, isSecond: count === 2 };
}
