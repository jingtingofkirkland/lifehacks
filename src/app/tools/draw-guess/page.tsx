import type { Metadata } from 'next';
import DrawGuess from './DrawGuess';

export const metadata: Metadata = {
  title: 'Draw & Guess 你画我猜: Pass-and-Play Drawing Game for Families - Great Seattle Life Hacks',
  description:
    'A free pass-and-play Pictionary-style game for families: one phone, one secret word, one drawing — everyone else guesses out loud. 140+ bilingual EN/中文 words in 5 themes, big touch-friendly drawing board, no accounts, no downloads.',
  alternates: {
    canonical: 'https://lifehacks.zeey-app.net/tools/draw-guess/',
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
