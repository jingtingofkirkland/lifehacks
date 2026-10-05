'use client';

/**
 * Print button for the Beast Academy companion articles: prints the whole
 * page (article + practice problems) via the browser's print dialog.
 * Follows the same window.print() pattern as the Kangaroo practice pages.
 */
export function PrintButton({ label = '🖨️ 打印本页' }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      data-testid="ba-print"
      className="print:hidden text-sm font-semibold px-4 py-2 rounded-full border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
    >
      {label}
    </button>
  );
}
