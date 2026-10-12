import Link from 'next/link';

/**
 * The one subscribe card used across the site (Top 2 exposure wave,
 * 2026-10-12): same promise, same destination everywhere, so every page
 * that earns attention also offers the Friday email. Pure exposure —
 * it never gates or hides content.
 *
 * `linkTestId` exists for pages whose e2e specs locate the CTA link.
 */
export function SubscribeCta({
  testId = 'subscribe-cta',
  linkTestId,
  className = '',
}: {
  testId?: string;
  linkTestId?: string;
  className?: string;
}) {
  return (
    <div
      data-testid={testId}
      className={`rounded-2xl border border-emerald-200/70 dark:border-emerald-800/40 bg-emerald-50/60 dark:bg-emerald-950/20 p-6 text-center ${className}`}
    >
      <p className="font-bold text-lg mb-1">
        📬 Get the Weekly Worksheet — 3 new problems every Friday, free
      </p>
      <p className="text-sm text-muted-foreground mb-4">
        One short email every Friday: hand-picked Kangaroo-style problems, a
        printable practice sheet, and a peek at next week. Free, no spam,
        unsubscribe anytime.
      </p>
      <Link
        href="/newsletter/"
        data-testid={linkTestId}
        className="inline-block px-6 py-2.5 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
      >
        Subscribe free →
      </Link>
    </div>
  );
}
