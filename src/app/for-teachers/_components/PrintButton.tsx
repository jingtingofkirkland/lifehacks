'use client';

/**
 * Print button for the teacher pages: opens the browser print dialog for
 * the current page. Same window.print() pattern as the Kangaroo practice
 * pages and the Beast Academy companion articles; hidden when printing.
 */
export function PrintButton({
  label = '🖨️ Print',
  testId,
  className = '',
}: {
  label?: string;
  testId?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      data-testid={testId}
      className={`print:hidden inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-emerald-950 transition-colors ${className}`}
    >
      {label}
    </button>
  );
}
