'use client';

/**
 * Prints a single pumpkin stencil: marks the chosen stencil on <html>
 * (data-print-target), opens the print dialog, and lets the page's print
 * CSS hide everything except that stencil at near-full page size.
 * Other stencils / page chrome stay on screen untouched.
 */
export function PrintStencilButton({
  stencilId,
  label = '🖨️ Print this stencil',
}: {
  stencilId: string;
  label?: string;
}) {
  const handleClick = () => {
    const root = document.documentElement;
    root.setAttribute('data-print-target', stencilId);
    const clear = () => root.removeAttribute('data-print-target');
    window.addEventListener('afterprint', clear, { once: true });
    window.print();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      data-testid={`print-stencil-${stencilId}`}
      className="text-sm font-semibold px-4 py-2 rounded-full bg-orange-600 text-white hover:bg-orange-700 transition-colors"
    >
      {label}
    </button>
  );
}
