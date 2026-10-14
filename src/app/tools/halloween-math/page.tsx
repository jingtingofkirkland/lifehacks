import type { Metadata } from 'next';
import { HalloweenHunt } from './HalloweenHunt';

export const metadata: Metadata = {
  title: 'Halloween Math Hunt: 12 Free Printable Problems (Grades 3–4) - Great Seattle Life Hacks',
  description:
    'A free Halloween math treasure hunt for grades 3–4: play 6 spooky-but-friendly Kangaroo-style problems online, then print the full pack — all 12 problems with an answer key.',
  alternates: {
    canonical: 'https://lifehacks.zeey-app.net/tools/halloween-math/',
  },
};

/**
 * Halloween Math Hunt (IDEA-20261011-01): a seasonal pack of 12 original
 * Halloween problems. Six are playable online; six are print-only, so the
 * printable pack is the complete hunt. All problems are original and
 * written in the Kangaroo spirit — the page carries a disclaimer.
 */
export default function HalloweenMathPage() {
  return <HalloweenHunt />;
}
