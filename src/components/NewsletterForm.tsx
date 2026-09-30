'use client';

import { getNewsletterFormUrl } from '@/lib/newsletter';

/**
 * Reusable newsletter signup block.
 *
 * Embeds the Tally signup form once NEXT_PUBLIC_TALLY_FORM_URL is
 * configured. Until then it renders an honest "coming soon" placeholder —
 * never a fake form.
 */
export function NewsletterForm() {
  const formUrl = getNewsletterFormUrl();

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
        src={formUrl}
        title="Weekly math worksheet newsletter signup"
        loading="lazy"
        className="w-full min-h-[400px] border-0"
      />
    </div>
  );
}
