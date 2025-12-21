import { HeroSections } from '@/components';
import { siteConfig } from '@/config/site';

export default function HomePage() {
  return (
    <main className="h-screen overflow-hidden">
      <HeroSections sections={siteConfig.heroSections} />
    </main>
  );
}
