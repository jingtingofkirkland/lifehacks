'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { UsefulnessFeedback } from '@/components/UsefulnessFeedback';
import { MATH_TOOL_CSS, MATH_TOOL_HTML, MATH_TOOL_JS } from './tool-content';

/**
 * Kids Math — Bridge Builder. A word-problem game: kids read (or listen to)
 * story problems and solve them; each correct answer lays a bridge plank and
 * an animal crosses the river. Wrong answers wobble the plank and reveal a
 * drawing hint on the bridge pier, plus a printable worksheet. Themed with
 * the site's design tokens; all CSS is scoped under `.math-tool` and mapped
 * to the site's shadcn variables so light/dark mode follows the rest of the
 * site.
 */
export default function MathBridgeBuilderPage() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = 'Bridge Builder: Word Problem Game for Kids - Great Seattle Life Hacks';
    const root = mountRef.current;
    if (!root) return;

    root.innerHTML = MATH_TOOL_HTML;

    const styleEl = document.createElement('style');
    styleEl.setAttribute('data-math-tool', 'bridge-builder');
    styleEl.textContent = MATH_TOOL_CSS;
    root.appendChild(styleEl);

    const scriptEl = document.createElement('script');
    scriptEl.textContent = MATH_TOOL_JS;
    root.appendChild(scriptEl);

    return () => {
      root.innerHTML = '';
    };
  }, []);

  return (
    <article className="min-h-screen bg-gradient-to-b from-sky-50 via-background to-background dark:from-sky-950/20 dark:via-background dark:to-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Back link */}
        <Link
          href="/tools"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors group"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="group-hover:-translate-x-0.5 transition-transform"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back to Tools
        </Link>

        {/* Tool mount point */}
        <div ref={mountRef} className="math-tool" />

        {/* Feedback */}
        <div className="mt-12 mb-10">
          <UsefulnessFeedback
            page="tools-math-bridge-builder"
            prompt="Was this tool helpful?"
            helper="One click helps us build more free tools you'll actually use."
          />
        </div>

        <div className="text-center pb-8">
          <p className="text-xs text-muted-foreground/50">
            Progress is saved in this browser only. No data collected. Runs entirely on your device.
          </p>
        </div>
      </div>
    </article>
  );
}
