import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Bridge Builder: Word Problem Game for Kids - Great Seattle Life Hacks',
  description:
    'Solve story problems to lay bridge planks, get drawing hints when stuck, and print custom worksheets.',
  alternates: { canonical: 'https://lifehacks.zeey-app.net/tools/math-bridge-builder/' },
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
