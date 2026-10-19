import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Merge Racer: Addition Game for Kids - Great Seattle Life Hacks',
  description:
    'Tap two number cars to merge into the target number, get racing tips when stuck, and print custom worksheets.',
  alternates: { canonical: 'https://lifehacks.zeey-app.net/tools/math-addition/' },
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
