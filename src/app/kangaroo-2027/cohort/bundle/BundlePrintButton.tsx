'use client';

import { trackEvent } from '@/lib/pixel';

/**
 * Print button for the cohort bundle: fires the WorksheetPrinted event
 * (game: 'cohort-bundle') so bundle downloads are measurable, then
 * opens the browser print dialog. Same pattern as the Kangaroo
 * practice worksheet in KangarooPrep.tsx.
 */
export function BundlePrintButton({
  label = '🖨️ Print the whole bundle',
  testId,
}: {
  label?: string;
  testId?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        trackEvent('WorksheetPrinted', { game: 'cohort-bundle' });
        window.print();
      }}
      data-testid={testId}
      className="print:hidden inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-full bg-orange-600 text-white font-semibold hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-400 dark:text-orange-950 transition-colors"
    >
      {label}
    </button>
  );
}
