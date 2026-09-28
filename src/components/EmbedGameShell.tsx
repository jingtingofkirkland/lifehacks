'use client';

import { useEffect, useRef } from 'react';

interface EmbedGameShellProps {
  /** Slug used for the injected style tag, e.g. 'math-addition'. */
  gameSlug: string;
  /** Raw HTML string the game mounts into (from the tool's tool-content). */
  html: string;
  /** Raw CSS string for the game (from the tool's tool-content). */
  css: string;
  /** Raw JS string for the game (from the tool's tool-content). */
  js: string;
}

/**
 * Chromeless shell for embedding a kids math game on partner sites via
 * iframe (e.g. `/embed/math-addition/`).
 *
 * The game itself is mounted exactly like on its standalone tool page
 * (innerHTML + injected style/script), so behavior is identical. The only
 * chrome is a slim "Powered by LifeHacks" attribution bar linking back to
 * the site. The floating site chrome (theme toggle, feedback pills,
 * Messenger bubble) is suppressed on `/embed/*` routes by the components
 * themselves — see ThemeToggle, FeedbackButton, MessengerBubble.
 *
 * To embed another game, add `src/app/embed/<slug>/page.tsx` following
 * `src/app/embed/math-addition/page.tsx` and pass that game's content here.
 */
export function EmbedGameShell({ gameSlug, html, css, js }: EmbedGameShellProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = mountRef.current;
    if (!root) return;

    root.innerHTML = html;

    const styleEl = document.createElement('style');
    styleEl.setAttribute('data-embed-game', gameSlug);
    styleEl.textContent = css;
    root.appendChild(styleEl);

    const scriptEl = document.createElement('script');
    scriptEl.textContent = js;
    root.appendChild(scriptEl);

    return () => {
      root.innerHTML = '';
    };
  }, [gameSlug, html, css, js]);

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <main className="flex-1">
        <div ref={mountRef} className="math-tool" data-testid="embed-game-mount" />
      </main>
      <footer className="flex items-center justify-center gap-1.5 border-t border-border/60 bg-muted/40 px-2 py-1.5 text-[11px] leading-none text-muted-foreground">
        <span>Powered by</span>
        <a
          href="https://lifehacks.zeey-app.net/?utm_source=embed&utm_medium=referral&utm_campaign=embed-math-addition"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-foreground hover:underline"
        >
          LifeHacks
        </a>
        <span aria-hidden="true">·</span>
        <span>Free math games for kids</span>
      </footer>
    </div>
  );
}
