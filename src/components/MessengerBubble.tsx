'use client';

import { useEffect, useState } from 'react';
import { siteConfig } from '@/config/site';
import { getStoredUtm } from '@/lib/utm';

const DISMISS_KEY = 'messenger-bubble-dismissed';

function trackMessengerClick() {
  if (
    typeof window !== 'undefined' &&
    typeof (window as any).fbq === 'function'
  ) {
    (window as any).fbq('trackCustom', 'Reachout', {
      channel: 'messenger',
      ...getStoredUtm(),
    });
  }
}

/**
 * Floating Messenger chat bubble, rendered on every page via the root layout.
 *
 * Fixed to the bottom-right corner on all viewports:
 * - Mobile: sits just above the iOS home-indicator safe area. Because a
 *   fixed bubble can cover game controls on small screens, it is
 *   dismissible on mobile (choice remembered for the session).
 * - Desktop (sm+): sits above the floating feedback pills stack (bottom-28
 *   clears the two-pill column), sharing the same right-4 gutter.
 *
 * Opens the site's official Messenger channel in a new tab.
 */
export function MessengerBubble() {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(DISMISS_KEY) === '1') {
        setDismissed(true);
      }
    } catch {
      /* sessionStorage unavailable — keep the bubble visible */
    }
  }, []);

  if (dismissed) {
    return null;
  }

  const dismiss = () => {
    try {
      window.sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* ignore */
    }
    setDismissed(true);
  };

  return (
    <div
      data-testid="messenger-bubble-wrap"
      className="fixed right-4 z-50 print:hidden bottom-[max(1rem,env(safe-area-inset-bottom))] sm:bottom-28"
    >
      <button
        type="button"
        onClick={dismiss}
        data-testid="messenger-bubble-dismiss"
        aria-label="Dismiss Messenger chat bubble"
        title="Dismiss"
        className="sm:hidden absolute -top-2 -right-2 z-10 flex items-center justify-center w-6 h-6 rounded-full bg-black/60 hover:bg-black/80 text-white text-xs leading-none shadow"
      >
        <svg
          className="w-3 h-3"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
      <a
        href={siteConfig.messengerUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={trackMessengerClick}
        data-testid="messenger-bubble"
        aria-label="Chat with us on Messenger"
        title="Chat with us on Messenger"
        className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#0084FF] hover:bg-[#006fd6] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
      >
        <svg
          className="w-6 h-6 sm:w-7 sm:h-7"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.14.25.35.25.57l.05 1.78c.02.57.66.9 1.15.63l2.12-1.16c.2-.11.44-.14.66-.08.83.2 1.71.31 2.63.31 5.64 0 10-4.13 10-9.3S17.64 2 12 2z"
            fill="currentColor"
          />
          <path
            d="M12.9 6.5 8.2 13h3l-.4 4.5 4.9-6.8h-3l.2-4.2z"
            fill="#0084FF"
          />
        </svg>
      </a>
    </div>
  );
}
