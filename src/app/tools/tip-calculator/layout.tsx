import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Tip Calculator - Great Seattle Life Hacks',
  description: 'Calculate tip, split the bill, and figure out per-person totals instantly.',
  alternates: { canonical: 'https://lifehacks.zeey-app.net/tools/tip-calculator/' },
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
