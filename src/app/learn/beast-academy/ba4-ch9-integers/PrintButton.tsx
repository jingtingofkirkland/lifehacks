'use client';

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex shrink-0 items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white transition-colors print:hidden"
    >
      🖨️ 打印这 5 道题
    </button>
  );
}
