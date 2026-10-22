import type { Metadata, Viewport } from 'next';
import DrawGuess from './DrawGuess';

/**
 * Phone-first PWA chrome, scoped to this page only: the game runs
 * fullscreen on a handed-around phone, so it gets the notch-safe
 * viewport, a theme color, and a manifest that lets "Add to Home
 * Screen" install it as a standalone app. The rest of the site keeps
 * the root layout's defaults.
 */
export const viewport: Viewport = {
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0284c7' },
    { media: '(prefers-color-scheme: dark)', color: '#082f49' },
  ],
};

export const metadata: Metadata = {
  title: 'Draw & Guess 你画我猜: Pass-and-Play Drawing Game for Families - Great Seattle Life Hacks',
  description:
    'A free pass-and-play Pictionary-style game for families: one phone, one secret word, one drawing — everyone else guesses out loud. 140+ bilingual EN/中文 words in 5 themes, big touch-friendly drawing board, no accounts, no downloads.',
  alternates: {
    canonical: 'https://lifehacks.zeey-app.net/tools/draw-guess/',
  },
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: '你画我猜',
    statusBarStyle: 'default',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

/**
 * Draw & Guess （你画我猜）: single-phone pass-and-play drawing game.
 * Pure static client page — no backend, no rooms, no accounts. The word
 * stays masked (hold-to-peek) until the family taps Reveal.
 */
export default function DrawGuessPage() {
  return <DrawGuess />;
}
