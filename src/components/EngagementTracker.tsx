'use client';

/**
 * Site-wide engagement tracker: dwell time, scroll depth, pages per session.
 *
 * Rendered once in the root layout. Fires Meta Pixel custom events
 * (production host only — see src/lib/pixel.ts) so Events Manager can
 * distinguish "landed and bounced" from "stayed and browsed":
 *   Dwell10s / Dwell30s / Dwell60s / Dwell120s  — visible tab time, per page view
 *   Scroll25 / Scroll50 / Scroll75 / Scroll90   — max scroll depth, per page view
 *   SecondPageView                              — once per session
 *
 * Dwell accumulates only while the tab is visible (Page Visibility API).
 * Scroll uses a passive, rAF-throttled listener. Client-side navigations in
 * the Next.js App Router do not remount the layout, so pushState/replaceState
 * and popstate are observed to reset the per-page-view state — mirroring the
 * Pixel snippet's PageView tracking in the root layout.
 *
 * Everything is wrapped in try/catch: tracking must never break rendering.
 */
import { useEffect } from 'react';
import { trackEvent } from '@/lib/pixel';
import {
  SECOND_PAGE_VIEW_EVENT,
  SESSION_PAGE_VIEWS_KEY,
  incrementPageViewCount,
  reachedDwellEvents,
  reachedScrollEvents,
  scrollDepthPercent,
} from '@/lib/engagement';

function currentPage(): string {
  try {
    return window.location.pathname || '/';
  } catch {
    return '/';
  }
}

export function EngagementTracker() {
  useEffect(() => {
    try {
      const firedDwell = new Set<string>();
      const firedScroll = new Set<string>();
      let visibleSeconds = 0;
      let maxDepth = 0;

      const fireDwellDue = () => {
        for (const name of reachedDwellEvents(visibleSeconds)) {
          if (!firedDwell.has(name)) {
            firedDwell.add(name);
            trackEvent(name, { page: currentPage() });
          }
        }
      };

      const checkScroll = () => {
        const depth = scrollDepthPercent(
          window.scrollY,
          window.innerHeight,
          document.documentElement.scrollHeight,
        );
        if (depth > maxDepth) {
          maxDepth = depth;
          for (const name of reachedScrollEvents(maxDepth)) {
            if (!firedScroll.has(name)) {
              firedScroll.add(name);
              trackEvent(name, { page: currentPage() });
            }
          }
        }
      };

      // Defer the scroll check past navigation renders so the measurement
      // reflects the new page, not the old one being torn down.
      const scheduleScrollCheck = () => {
        window.requestAnimationFrame(() => {
          window.setTimeout(() => {
            try {
              checkScroll();
            } catch {
              /* ignore */
            }
          }, 0);
        });
      };

      const newPageView = () => {
        try {
          const res = incrementPageViewCount(
            sessionStorage.getItem(SESSION_PAGE_VIEWS_KEY),
          );
          sessionStorage.setItem(SESSION_PAGE_VIEWS_KEY, String(res.count));
          if (res.isSecond) {
            trackEvent(SECOND_PAGE_VIEW_EVENT, { page: currentPage() });
          }
        } catch {
          // sessionStorage unavailable — skip the session counter only.
        }
        firedDwell.clear();
        firedScroll.clear();
        visibleSeconds = 0;
        maxDepth = 0;
        scheduleScrollCheck();
      };

      // Dwell: tick once per second, counting only visible time.
      const dwellTimer = window.setInterval(() => {
        try {
          if (document.visibilityState !== 'visible') return;
          visibleSeconds += 1;
          fireDwellDue();
        } catch {
          /* ignore */
        }
      }, 1000);

      // Scroll: passive listener, rAF-throttled.
      let ticking = false;
      const onScroll = () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(() => {
          ticking = false;
          try {
            checkScroll();
          } catch {
            /* ignore */
          }
        });
      };
      window.addEventListener('scroll', onScroll, { passive: true });

      const historyAny = window.history as unknown as {
        pushState: (...args: unknown[]) => unknown;
        replaceState: (...args: unknown[]) => unknown;
      };
      const origPush = historyAny.pushState.bind(window.history);
      const origReplace = historyAny.replaceState.bind(window.history);
      historyAny.pushState = (...args: unknown[]) => {
        const ret = origPush(...args);
        newPageView();
        return ret;
      };
      historyAny.replaceState = (...args: unknown[]) => {
        const ret = origReplace(...args);
        newPageView();
        return ret;
      };
      const onPopState = () => newPageView();
      window.addEventListener('popstate', onPopState);

      newPageView(); // initial page view

      return () => {
        window.clearInterval(dwellTimer);
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('popstate', onPopState);
        historyAny.pushState = origPush;
        historyAny.replaceState = origReplace;
      };
    } catch {
      // Tracking must never break rendering.
    }
    return undefined;
  }, []);

  return null;
}
