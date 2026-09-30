/**
 * Unit tests for the engagement tracking helpers (src/lib/engagement.ts).
 *
 * Pure, DOM-free logic: dwell bucket thresholds, scroll-depth percentage
 * math, and the per-session page view counter. The browser wiring in
 * EngagementTracker.tsx is deliberately thin and untested here (no
 * component testing library installed); it only calls these helpers and
 * pixel.trackEvent, which is itself gated and never throws.
 */
import { describe, expect, it } from 'vitest';
import {
  SECOND_PAGE_VIEW_EVENT,
  SESSION_PAGE_VIEWS_KEY,
  incrementPageViewCount,
  reachedDwellEvents,
  reachedScrollEvents,
  scrollDepthPercent,
} from './engagement';

describe('reachedDwellEvents', () => {
  it('fires nothing before the first threshold', () => {
    expect(reachedDwellEvents(0)).toEqual([]);
    expect(reachedDwellEvents(9)).toEqual([]);
  });

  it('fires Dwell10s exactly at 10 seconds', () => {
    expect(reachedDwellEvents(10)).toEqual(['Dwell10s']);
  });

  it('accumulates buckets: 35s reaches 10s and 30s', () => {
    expect(reachedDwellEvents(35)).toEqual(['Dwell10s', 'Dwell30s']);
  });

  it('fires all four buckets at and beyond 120 seconds', () => {
    expect(reachedDwellEvents(120)).toEqual([
      'Dwell10s',
      'Dwell30s',
      'Dwell60s',
      'Dwell120s',
    ]);
    expect(reachedDwellEvents(3600)).toEqual([
      'Dwell10s',
      'Dwell30s',
      'Dwell60s',
      'Dwell120s',
    ]);
  });

  it('never repeats a bucket name', () => {
    const names = reachedDwellEvents(999);
    expect(new Set(names).size).toBe(names.length);
  });
});

describe('scrollDepthPercent', () => {
  it('returns 100 when the page fits on one screen', () => {
    expect(scrollDepthPercent(0, 800, 600)).toBe(100);
    expect(scrollDepthPercent(0, 800, 800)).toBe(100);
  });

  it('measures the seen fraction at the top of a tall page', () => {
    // 800px viewport over a 4000px page: 20% seen at scrollY=0.
    expect(scrollDepthPercent(0, 800, 4000)).toBe(20);
  });

  it('reaches 100 when scrolled to the bottom', () => {
    expect(scrollDepthPercent(3200, 800, 4000)).toBe(100);
  });

  it('clamps out-of-range inputs', () => {
    // Overscroll above the top still shows part of the page (7.5% here);
    // only a fully-negative viewport clamps to 0.
    expect(scrollDepthPercent(-500, 800, 4000)).toBe(7.5);
    expect(scrollDepthPercent(-900, 800, 4000)).toBe(0);
    expect(scrollDepthPercent(99999, 800, 4000)).toBe(100);
  });

  it('returns 0 for degenerate dimensions', () => {
    expect(scrollDepthPercent(0, 0, 4000)).toBe(0);
    expect(scrollDepthPercent(0, 800, 0)).toBe(0);
  });
});

describe('reachedScrollEvents', () => {
  it('fires nothing below 25%', () => {
    expect(reachedScrollEvents(0)).toEqual([]);
    expect(reachedScrollEvents(24.9)).toEqual([]);
  });

  it('fires Scroll25 exactly at 25%', () => {
    expect(reachedScrollEvents(25)).toEqual(['Scroll25']);
  });

  it('accumulates milestones', () => {
    expect(reachedScrollEvents(80)).toEqual([
      'Scroll25',
      'Scroll50',
      'Scroll75',
    ]);
  });

  it('fires all milestones at 90% and beyond', () => {
    const all = ['Scroll25', 'Scroll50', 'Scroll75', 'Scroll90'];
    expect(reachedScrollEvents(90)).toEqual(all);
    expect(reachedScrollEvents(100)).toEqual(all);
  });
});

describe('incrementPageViewCount', () => {
  it('starts at 1 on a fresh session (no stored value)', () => {
    expect(incrementPageViewCount(null)).toEqual({
      count: 1,
      isSecond: false,
    });
  });

  it('flags the second page view exactly once', () => {
    expect(incrementPageViewCount('1')).toEqual({
      count: 2,
      isSecond: true,
    });
    expect(incrementPageViewCount('2')).toEqual({
      count: 3,
      isSecond: false,
    });
  });

  it('treats missing or garbage input as a fresh session', () => {
    expect(incrementPageViewCount('')).toEqual({ count: 1, isSecond: false });
    expect(incrementPageViewCount('abc')).toEqual({
      count: 1,
      isSecond: false,
    });
    expect(incrementPageViewCount('-3')).toEqual({
      count: 1,
      isSecond: false,
    });
  });

  it('exposes the constants the tracker wires to sessionStorage', () => {
    expect(SECOND_PAGE_VIEW_EVENT).toBe('SecondPageView');
    expect(SESSION_PAGE_VIEWS_KEY).toBe('engagement_page_views');
  });
});
