import Link from 'next/link';
import { Metadata } from 'next';
import { UsefulnessFeedback } from '@/components/UsefulnessFeedback';
import { GameCard } from './GameCard';

export const metadata: Metadata = {
  title: 'Education: Learning Games for Kids - Great Seattle Life Hacks',
  description:
    'Mini learning games for kids: learn through practice, get tips the moment you get stuck, no separate lessons. Printable worksheets included.',
};

const games = [
  {
    title: 'Merge Racer: Addition Game for Kids',
    desc: 'Tap two number cars to merge into the target number, get racing tips when stuck, and print custom worksheets.',
    href: '/tools/math-addition',
    game: 'merge_racer',
    icon: (
      <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="24" fill="#D1FAE5" stroke="#059669" strokeWidth="2"/>
        <path d="M32 20v24M20 32h24" stroke="#059669" strokeWidth="5" strokeLinecap="round"/>
      </svg>
    ),
    tag: 'Addition',
  },
  {
    title: 'Bubble Pop: Missing Number Game for Kids',
    desc: 'Pop the bubble holding the missing number, get ten-frame tips when stuck, and print custom worksheets.',
    href: '/tools/math-bubble-pop',
    game: 'bubble_pop',
    icon: (
      <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="30" r="20" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2"/>
        <ellipse cx="25" cy="23" rx="6" ry="4" fill="#FFFFFF" opacity="0.8" transform="rotate(-24 25 23)"/>
        <text x="32" y="38" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#0284C7">?</text>
      </svg>
    ),
    tag: 'Missing number',
  },
  {
    title: 'Bridge Builder: Word Problem Game for Kids',
    desc: 'Solve story problems to lay bridge planks, get drawing hints when stuck, and print custom worksheets.',
    href: '/tools/math-bridge-builder',
    game: 'bridge_builder',
    icon: (
      <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
        <rect x="6" y="38" width="52" height="18" rx="4" fill="#BAE6FD" stroke="#0284C7" strokeWidth="2"/>
        <path d="M10 38 Q32 16 54 38" stroke="#B45309" strokeWidth="5" fill="none" strokeLinecap="round"/>
        <path d="M20 32v6M32 27v11M44 32v6" stroke="#B45309" strokeWidth="4" strokeLinecap="round"/>
      </svg>
    ),
    tag: 'Word problems',
  },
];

/* decorative SVGs */
const CapSvg = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" className="text-emerald-300/20 dark:text-emerald-600/10">
    <path d="M60 30 L100 48 L60 66 L20 48 Z" fill="currentColor"/>
    <path d="M40 56 V74 C40 82 80 82 80 74 V56" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round"/>
    <line x1="100" y1="48" x2="100" y2="72" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
    <circle cx="100" cy="78" r="5" fill="currentColor"/>
  </svg>
);

const PencilSvg = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="text-teal-400/15 dark:text-teal-600/10">
    <path d="M20 60 L28 44 L52 20 L60 28 L36 52 Z" fill="currentColor"/>
    <path d="M20 60 L18 68 L26 66 Z" fill="currentColor"/>
  </svg>
);

export default function EducationPage() {
  return (
    <article className="min-h-screen bg-gradient-to-b from-emerald-50 via-teal-50/80 to-background dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-background relative overflow-hidden">

      {/* ── Decorative background elements ── */}
      <div className="absolute top-12 right-[-30px] opacity-60 pointer-events-none select-none" aria-hidden><CapSvg /></div>
      <div className="absolute top-[340px] left-[-20px] opacity-50 pointer-events-none select-none rotate-[-30deg]" aria-hidden><PencilSvg /></div>
      <div className="absolute bottom-20 right-4 opacity-30 pointer-events-none select-none rotate-[15deg]" aria-hidden><PencilSvg /></div>

      <div className="relative max-w-3xl mx-auto px-4 py-8">
        {/* ── Back link ── */}
        <Link href="/tools" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors group">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform"><path d="M15 18l-6-6 6-6"/></svg>
          Back to Tools
        </Link>

        {/* ── Page header ── */}
        <div className="mt-8 mb-10 text-center">
          {/* decorative line */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-emerald-400/60" />
            <span className="text-emerald-500 dark:text-emerald-400 text-2xl">&#10022;</span>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-emerald-400/60" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
            Education
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
            Kids learn by playing here. Every game teaches through practice:
            helpful tips pop up the moment a child gets stuck, so there are no
            separate lessons to sit through. Each game also comes with a
            printable worksheet, so the practice can go on the fridge.
          </p>
        </div>

        {/* ── Games grid ── */}
        <section className="mb-12">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {games.map((game) => (
              <GameCard
                key={game.href}
                href={game.href}
                game={game.game}
                className="group relative block p-6 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/40
                  bg-white/80 dark:bg-card/80 backdrop-blur-sm
                  hover:shadow-xl hover:shadow-emerald-200/40 dark:hover:shadow-emerald-900/20
                  hover:border-emerald-300 dark:hover:border-emerald-600
                  hover:-translate-y-0.5
                  transition-all duration-300"
              >
                {/* tag */}
                {game.tag && (
                  <span className="absolute top-3 right-3 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                    {game.tag}
                  </span>
                )}
                <div className="flex items-start gap-4">
                  <div className="shrink-0 mt-0.5 p-2 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 border border-emerald-100 dark:border-emerald-900/30 group-hover:scale-110 transition-transform duration-300">
                    {game.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      {game.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{game.desc}</p>
                    <span className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-emerald-600 dark:text-emerald-400 group-hover:gap-2 transition-all">
                      Play now
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </span>
                  </div>
                </div>
              </GameCard>
            ))}
          </div>
        </section>

        {/* ── Feedback ── */}
        <div className="mb-10">
          <UsefulnessFeedback
            page="tools-education"
            prompt="Was this page helpful?"
            helper="One click helps us build more free learning games you'll actually use."
          />
        </div>

        {/* ── Footer accent ── */}
        <div className="text-center pb-8">
          <p className="text-xs text-muted-foreground/50">More learning games coming soon.</p>
        </div>
      </div>
    </article>
  );
}
