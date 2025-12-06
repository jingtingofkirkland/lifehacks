import Link from 'next/link';
import { Header, Footer } from '@/components';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { siteConfig } from '@/config/site';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <header className="relative pb-12 mb-8 bg-gradient-to-br from-background via-muted/30 to-background rounded-b-3xl overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(99,102,241,0.1),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.1),transparent_50%)] pointer-events-none" />

        <div className="container max-w-4xl mx-auto px-4 pt-8 relative">
          <Header navItems={siteConfig.navbarEntries} />

          {/* Hero Content */}
          <div className="text-center py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-6xl mb-6 animate-bounce">🌟</div>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              {siteConfig.title}
            </h1>
            <div
              className="max-w-2xl mx-auto p-6 bg-card/80 backdrop-blur rounded-2xl shadow-xl border text-muted-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: siteConfig.description }}
            />
          </div>
        </div>

        {/* Wave SVG */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-12">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor" className="text-background"></path>
          </svg>
        </div>
      </header>

      <div className="container max-w-4xl mx-auto px-4">
        {/* Projects Section */}
        <section className="mb-16">
          <h2 className="flex items-center gap-3 text-2xl font-bold mb-8 pb-3 border-b-2 border-primary">
            <span className="text-2xl">✨</span>
            {siteConfig.sectionTitles.projects}
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {siteConfig.projectEntries.map((item) => {
              const cardContent = (
                <Card className="h-full text-center group cursor-pointer overflow-hidden relative">
                  {/* Top gradient bar on hover */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  <CardHeader className="p-6">
                    <CardTitle className="text-lg bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent group-hover:from-purple-500 group-hover:to-primary transition-all">
                      {item.title}
                    </CardTitle>
                    <div className="w-12 h-0.5 mx-auto my-3 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                    {item.desc && (
                      <CardDescription className="text-sm leading-relaxed">
                        {item.desc}
                      </CardDescription>
                    )}
                  </CardHeader>
                </Card>
              );

              return item.url.startsWith('http') ? (
                <a key={item.url} href={item.url} target="_blank" rel="noopener noreferrer" className="block">
                  {cardContent}
                </a>
              ) : (
                <Link key={item.url} href={item.url} className="block">
                  {cardContent}
                </Link>
              );
            })}
          </div>
        </section>

        <Footer items={siteConfig.footerEntries} author={siteConfig.author} />
      </div>
    </main>
  );
}
