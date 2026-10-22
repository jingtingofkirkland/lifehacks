import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: '2026 Printable Calendar - Great Seattle Life Hacks',
  description:
    'Free printable 2026 calendar with US holidays and Bellevue school days: month and year views, cute stickers, ready to print for the fridge or classroom.',
  alternates: { canonical: 'https://lifehacks.zeey-app.net/tools/calendar/2026/' },
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
