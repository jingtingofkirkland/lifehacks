import type { Metadata } from 'next';
import { HeroSections } from '@/components';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  alternates: { canonical: 'https://lifehacks.zeey-app.net/' },
};

export default function HomePage() {
  return (
    <main className="h-screen overflow-hidden">
      <HeroSections sections={siteConfig.heroSections} />
    </main>
  );
}
