import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Space Tech: Rocket Launch Tracker - Great Seattle Life Hacks',
  description:
    'Interactive rocket launch tracker: SpaceX and worldwide launches by year, visualized with charts.',
  alternates: { canonical: 'https://lifehacks.zeey-app.net/space/' },
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
