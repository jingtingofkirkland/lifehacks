'use client';

import { useEffect } from 'react';
import { getNewsletterFormUrl } from '@/lib/newsletter';

const TALLY_EMBED_SCRIPT_URL = 'https://tally.so/widgets/embed.js';

/**
 * Give every not-yet-loaded Tally iframe its real src, so the form renders
 * even when Tally's embed script failed to load (offline, blocked, …) —
 * just without dynamic resizing. Mirrors the fallback in Tally's own
 * official embed snippet.
 */
function fallbackToStaticSrc() {
  document
    .querySelectorAll<HTMLIFrameElement>('iframe[data-tally-src]:not([src])')
    .forEach((frame) => {
      const src = frame.getAttribute('data-tally-src');
      if (src) frame.setAttribute('src', src);
    });
}

/**
 * Reusable newsletter signup block.
 *
 * Embeds the Tally signup form once NEXT_PUBLIC_TALLY_FORM_URL is
 * configured, using Tally's official dynamic-height embed pattern: the
 * iframe carries `data-tally-src` (no `src` initially) and Tally's embed
 * script sizes it to fit the form content via postMessage — responsive,
 * no fixed pixel heights. Until the URL is configured it renders an
 * honest "coming soon" placeholder — never a fake form.
 */
export function NewsletterForm() {
  const formUrl = getNewsletterFormUrl();

  useEffect(() => {
    if (!formUrl) return;

    const w = window as unknown as { Tally?: { loadEmbeds: () => void } };
    if (w.Tally) {
      // Script already loaded (e.g. by another instance): process embeds now.
      w.Tally.loadEmbeds();
      return;
    }
    if (document.querySelector('script[data-tally-embed]')) {
      // Script tag already injected and loading; its onload handler will
      // call Tally.loadEmbeds() for every data-tally-src iframe.
      return;
    }

    const script = document.createElement('script');
    script.src = TALLY_EMBED_SCRIPT_URL;
    script.async = true;
    script.setAttribute('data-tally-embed', '1');
    script.onload = () => {
      const t = (window as unknown as { Tally?: { loadEmbeds: () => void } })
        .Tally;
      if (t && typeof t.loadEmbeds === 'function') {
        t.loadEmbeds();
      } else {
        fallbackToStaticSrc();
      }
    };
    // Script failed to load: degrade gracefully, the form still renders.
    script.onerror = () => fallbackToStaticSrc();
    document.head.appendChild(script);
  }, [formUrl]);

  if (!formUrl) {
    return (
      <div
        data-testid="newsletter-placeholder"
        className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/40 p-8 text-center"
      >
        <p className="text-lg font-semibold mb-1">📬 Subscription opens soon</p>
        <p className="text-sm text-muted-foreground">
          Subscription opens soon — check back Friday.
        </p>
      </div>
    );
  }

  return (
    <div
      data-testid="newsletter-form"
      className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
    >
      <iframe
        data-tally-src={formUrl}
        title="Weekly math worksheet newsletter signup"
        loading="lazy"
        width="100%"
        className="w-full min-h-[300px] border-0"
      />
    </div>
  );
}
