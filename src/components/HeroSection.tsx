'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

interface Section {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  backgroundImage?: string;
  backgroundGradient?: string;
  url?: string;
  cta?: {
    label: string;
    scrollTo: string;
  };
  navButtons?: {
    label: string;
    scrollTo: string;
  }[];
}

const gradientMap: Record<string, string> = {
  'from-blue-900 via-indigo-900 to-slate-900': 'linear-gradient(to bottom, #1e3a8a, #312e81, #0f172a)',
  'from-slate-900 via-purple-900 to-indigo-900': 'linear-gradient(to bottom, #0f172a, #581c87, #312e81)',
  'from-emerald-900 via-teal-900 to-slate-900': 'linear-gradient(to bottom, #064e3b, #134e4a, #0f172a)',
};

interface HeroSectionsProps {
  sections: Section[];
}

export function HeroSections({ sections }: HeroSectionsProps) {
  const [activeSection, setActiveSection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const sectionHeight = window.innerHeight;
      const newActive = Math.round(scrollTop / sectionHeight);
      setActiveSection(Math.min(newActive, sections.length - 1));
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [sections.length]);

  const scrollToSection = (index: number) => {
    const container = containerRef.current;
    if (!container) return;

    container.scrollTo({
      top: index * window.innerHeight,
      behavior: 'smooth',
    });
  };

  const scrollToId = (id: string) => {
    const index = sections.findIndex(s => s.id === id);
    if (index !== -1) {
      scrollToSection(index);
    }
  };

  return (
    <div className="relative">
      {/* Scroll Container */}
      <div
        ref={containerRef}
        className="h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {sections.map((section, index) => (
          <section
            key={section.id}
            id={section.id}
            className="h-screen w-full snap-start snap-always flex flex-col items-center justify-center relative overflow-hidden"
            style={{
              background: section.backgroundGradient
                ? gradientMap[section.backgroundGradient] || '#0f172a'
                : '#0f172a',
            }}
          >
            {/* Background overlay for better text readability */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Animated particles/stars effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white/30 rounded-full animate-twinkle"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${2 + Math.random() * 3}s`,
                  }}
                />
              ))}
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
              <h1
                className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-4 tracking-tight
                  animate-in fade-in slide-in-from-bottom-8 duration-700"
              >
                {section.title}
              </h1>

              <p
                className="text-xl sm:text-2xl text-white/80 mb-6 font-light tracking-wide
                  animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150"
              >
                {section.subtitle}
              </p>

              <p
                className="text-base sm:text-lg text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed
                  animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300"
              >
                {section.description}
              </p>

              {/* CTA Button */}
              {section.url ? (
                <Link
                  href={section.url}
                  className="inline-block px-8 py-3 border-2 border-white text-white font-medium
                    hover:bg-white hover:text-slate-900 transition-all duration-300
                    animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500"
                >
                  LEARN MORE
                </Link>
              ) : section.cta ? (
                <button
                  onClick={() => scrollToId(section.cta!.scrollTo)}
                  className="inline-block px-8 py-3 border-2 border-white text-white font-medium
                    hover:bg-white hover:text-slate-900 transition-all duration-300
                    animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500"
                >
                  {section.cta.label.toUpperCase()}
                </button>
              ) : null}

              {/* Navigation Buttons */}
              {section.navButtons && section.navButtons.length > 0 && (
                <div className="flex flex-wrap justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
                  {section.navButtons.map((btn) => (
                    <button
                      key={btn.scrollTo}
                      onClick={() => scrollToId(btn.scrollTo)}
                      className="px-6 py-3 border-2 border-white text-white font-medium
                        hover:bg-white hover:text-slate-900 transition-all duration-300"
                    >
                      {btn.label.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Scroll indicator */}
            {index < sections.length - 1 && (
              <button
                onClick={() => scrollToSection(index + 1)}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 hover:text-white
                  transition-colors duration-300 animate-bounce"
              >
                <ChevronDown className="w-8 h-8" />
              </button>
            )}
          </section>
        ))}
      </div>

      {/* Side navigation dots */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        {sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(index)}
            className={`
              w-3 h-3 rounded-full transition-all duration-300
              ${activeSection === index
                ? 'bg-white scale-125'
                : 'bg-white/40 hover:bg-white/70'
              }
            `}
            aria-label={`Go to ${section.title}`}
          />
        ))}
      </div>
    </div>
  );
}
