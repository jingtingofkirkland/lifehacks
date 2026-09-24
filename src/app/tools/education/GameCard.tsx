'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { trackEvent } from '@/lib/pixel';

/**
 * A game card link on the Education landing page.
 *
 * Reports a GameCardClick event to the Meta Pixel when clicked so we can see
 * which learning games visitors are interested in.
 */
export function GameCard({
  href,
  game,
  className,
  children,
}: {
  href: string;
  game: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => trackEvent('GameCardClick', { game })}
    >
      {children}
    </Link>
  );
}
