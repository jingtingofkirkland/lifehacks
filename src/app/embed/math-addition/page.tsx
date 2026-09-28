import type { Metadata } from 'next';
import { EmbedGameShell } from '@/components/EmbedGameShell';
import { MATH_TOOL_CSS, MATH_TOOL_HTML, MATH_TOOL_JS } from '@/app/tools/math-addition/tool-content';

export const metadata: Metadata = {
  title: 'Merge Racer: Addition Game for Kids (Embed) - Great Seattle Life Hacks',
  description:
    'Play Merge Racer, a free addition racing game for kids. Embeddable version for partner sites.',
  // Embed pages duplicate the standalone tool page content; keep them out of
  // search indexes so they don't dilute the canonical page's SEO.
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * Embeddable, chromeless variant of the Merge Racer game for partner sites
 * to iframe. No site navigation, no feedback widgets — just the game plus a
 * slim "Powered by LifeHacks" attribution bar.
 *
 * Pattern for future games: copy this file to
 * `src/app/embed/<game-slug>/page.tsx`, swap the tool-content import, and
 * adjust the metadata + utm_campaign.
 */
export default function EmbedMathAdditionPage() {
  return (
    <EmbedGameShell
      gameSlug="math-addition"
      html={MATH_TOOL_HTML}
      css={MATH_TOOL_CSS}
      js={MATH_TOOL_JS}
    />
  );
}
