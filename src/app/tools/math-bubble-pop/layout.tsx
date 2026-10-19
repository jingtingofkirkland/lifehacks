import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Bubble Pop: Missing Number Game for Kids - Great Seattle Life Hacks',
  description:
    'Pop the bubble holding the missing number, get ten-frame tips when stuck, and print custom worksheets.',
  alternates: { canonical: 'https://lifehacks.zeey-app.net/tools/math-bubble-pop/' },
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
