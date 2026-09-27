import Link from 'next/link';
import type { ReactNode } from 'react';
import { Metadata } from 'next';
import { UsefulnessFeedback } from '@/components/UsefulnessFeedback';

export const metadata: Metadata = {
  title: 'Life Saver Tools - Great Seattle Life Hacks',
  description: 'Printable calendars, handy tools, kids learning games, and local gems to make everyday life easier.',
};

interface ToolItem {
  title: string;
  desc: string;
  href: string;
  icon: ReactNode;
  tag: string;
}

const handyTools: ToolItem[] = [
  {
    title: '2026 Calendar',
    desc: 'Printable calendar with US holidays, BSD school days, cute stickers, month & year views.',
    href: '/tools/calendar/2026',
    icon: (
      <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
        <rect x="8" y="14" width="48" height="42" rx="4" fill="#FEF3C7" stroke="#D97706" strokeWidth="2"/>
        <rect x="8" y="14" width="48" height="12" rx="4" fill="#F59E0B"/>
        <rect x="14" y="10" width="4" height="10" rx="2" fill="#92400E"/>
        <rect x="46" y="10" width="4" height="10" rx="2" fill="#92400E"/>
        <text x="32" y="46" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#92400E">26</text>
      </svg>
    ),
    tag: 'Printable',
  },
  {
    title: 'Tip Calculator',
    desc: 'Calculate tip, split the bill, and figure out per-person totals instantly.',
    href: '/tools/tip-calculator',
    icon: (
      <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="24" fill="#D1FAE5" stroke="#059669" strokeWidth="2"/>
        <text x="32" y="38" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#059669">$</text>
      </svg>
    ),
    tag: 'Calculator',
  },
];

const eduGames: ToolItem[] = [
  {
    title: 'Merge Racer: Addition Game for Kids',
    desc: 'Tap two number cars to merge into the target number, get racing tips when stuck, and print custom worksheets.',
    href: '/tools/math-addition',
    icon: (
      <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="24" fill="#D1FAE5" stroke="#059669" strokeWidth="2"/>
        <path d="M32 20v24M20 32h24" stroke="#059669" strokeWidth="5" strokeLinecap="round"/>
      </svg>
    ),
    tag: 'Kids',
  },
  {
    title: 'Bubble Pop: Missing Number Game for Kids',
    desc: 'Pop the bubble holding the missing number, get ten-frame tips when stuck, and print custom worksheets.',
    href: '/tools/math-bubble-pop',
    icon: (
      <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="30" r="20" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2"/>
        <ellipse cx="25" cy="23" rx="6" ry="4" fill="#FFFFFF" opacity="0.8" transform="rotate(-24 25 23)"/>
        <text x="32" y="38" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#0284C7">?</text>
      </svg>
    ),
    tag: 'Kids',
  },
  {
    title: 'Bridge Builder: Word Problem Game for Kids',
    desc: 'Solve story problems to lay bridge planks, get drawing hints when stuck, and print custom worksheets.',
    href: '/tools/math-bridge-builder',
    icon: (
      <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
        <rect x="6" y="38" width="52" height="18" rx="4" fill="#BAE6FD" stroke="#0284C7" strokeWidth="2"/>
        <path d="M10 38 Q32 16 54 38" stroke="#B45309" strokeWidth="5" fill="none" strokeLinecap="round"/>
        <path d="M20 32v6M32 27v11M44 32v6" stroke="#B45309" strokeWidth="4" strokeLinecap="round"/>
      </svg>
    ),
    tag: 'Kids',
  },
];

const businesses = [
  { name: 'Sky Tree Service', category: 'Tree Removal', desc: 'Professional and budget-friendly Seattle local tree removal.', phone: '(206) 602-0070', emoji: '🌲' },
  { name: 'Evangeline Yu', category: 'Insurance', desc: 'Very helpful and patient agent.', url: 'https://www.comparioninsurance.com/insurance-agent/washington/tukwila-0671/evangelineyu', emoji: '🛡️' },
  { name: 'Arco Glass', category: 'Window/Door', desc: 'Budget prices with good quality work.', phone: '(206) 226-0013', emoji: '🪟' },
];

/* decorative SVGs */
const SunSvg = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" className="text-amber-300/20 dark:text-amber-600/10">
    <circle cx="60" cy="60" r="24" fill="currentColor"/>
    {[0,45,90,135,180,225,270,315].map(a => (
      <line key={a} x1="60" y1="60" x2={60 + 44 * Math.cos(a * Math.PI / 180)} y2={60 + 44 * Math.sin(a * Math.PI / 180)} stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    ))}
  </svg>
);

const LeafSvg = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="text-green-400/15 dark:text-green-600/10">
    <path d="M40 10 Q60 30 50 55 Q45 65 40 70 Q35 65 30 55 Q20 30 40 10Z" fill="currentColor"/>
    <path d="M40 25 L40 60" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/>
    <path d="M40 35 L48 28" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
    <path d="M40 45 L32 38" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
  </svg>
);

type CardAccent = 'amber' | 'emerald';

const cardAccents: Record<CardAccent, { card: string; tag: string; iconWrap: string; title: string; cta: string }> = {
  amber: {
    card: 'border-amber-200/80 dark:border-amber-800/40 hover:shadow-amber-200/40 dark:hover:shadow-amber-900/20 hover:border-amber-300 dark:hover:border-amber-600',
    tag: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
    iconWrap: 'from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 border-amber-100 dark:border-amber-900/30',
    title: 'group-hover:text-amber-700 dark:group-hover:text-amber-400',
    cta: 'text-amber-600 dark:text-amber-400',
  },
  emerald: {
    card: 'border-emerald-200/80 dark:border-emerald-800/40 hover:shadow-emerald-200/40 dark:hover:shadow-emerald-900/20 hover:border-emerald-300 dark:hover:border-emerald-600',
    tag: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
    iconWrap: 'from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 border-emerald-100 dark:border-emerald-900/30',
    title: 'group-hover:text-emerald-700 dark:group-hover:text-emerald-400',
    cta: 'text-emerald-600 dark:text-emerald-400',
  },
};

function ToolCard({ item, accent, ctaLabel }: { item: ToolItem; accent: CardAccent; ctaLabel: string }) {
  const a = cardAccents[accent];
  return (
    <Link
      href={item.href}
      className={`group relative block p-6 rounded-2xl border bg-white/80 dark:bg-card/80 backdrop-blur-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 ${a.card}`}
    >
      {/* tag */}
      {item.tag && (
        <span className={`absolute top-3 right-3 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${a.tag}`}>
          {item.tag}
        </span>
      )}
      <div className="flex items-start gap-4">
        <div className={`shrink-0 mt-0.5 p-2 rounded-xl bg-gradient-to-br border group-hover:scale-110 transition-transform duration-300 ${a.iconWrap}`}>
          {item.icon}
        </div>
        <div>
          <h3 className={`font-semibold text-lg transition-colors ${a.title}`}>
            {item.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{item.desc}</p>
          <span className={`inline-flex items-center gap-1 mt-3 text-xs font-medium group-hover:gap-2 transition-all ${a.cta}`}>
            {ctaLabel}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function ToolsPage() {
  return (
    <article className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50/80 to-background dark:from-orange-950/30 dark:via-amber-950/20 dark:to-background relative overflow-hidden">

      {/* ── Decorative background elements ── */}
      <div className="absolute top-12 right-[-30px] opacity-60 pointer-events-none select-none" aria-hidden><SunSvg /></div>
      <div className="absolute top-[340px] left-[-20px] opacity-50 pointer-events-none select-none rotate-[-30deg]" aria-hidden><LeafSvg /></div>
      <div className="absolute bottom-20 right-4 opacity-30 pointer-events-none select-none rotate-[15deg]" aria-hidden><LeafSvg /></div>

      <div className="relative max-w-3xl mx-auto px-4 py-8">
        {/* ── Back link ── */}
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors group">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform"><path d="M15 18l-6-6 6-6"/></svg>
          Back to Home
        </Link>

        {/* ── Page header ── */}
        <div className="mt-8 mb-12 text-center">
          {/* warm decorative line */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400/60" />
            <span className="text-amber-500 dark:text-amber-400 text-2xl">&#9758;</span>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400/60" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-3 bg-gradient-to-r from-amber-700 via-orange-600 to-rose-600 dark:from-amber-400 dark:via-orange-400 dark:to-rose-400 bg-clip-text text-transparent">
            Life Saver Tools
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
            Little things that make everyday life just a bit easier.
          </p>
        </div>

        {/* ── Education section ── */}
        <section className="mb-14">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-8 h-8 shrink-0 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5"/><path d="M22 10v6"/></svg>
              </span>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 truncate">
                Education &middot; Learning Games for Kids
              </h2>
            </div>
            <Link href="/tools/education" className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:gap-2 transition-all">
              View all learning games
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {eduGames.map((game) => (
              <ToolCard key={game.href} item={game} accent="emerald" ctaLabel="Play now" />
            ))}
          </div>
        </section>

        {/* ── Tools section ── */}
        <section className="mb-14">
          <div className="flex items-center gap-2 mb-5">
            <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
            </span>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Handy Tools
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {handyTools.map((tool) => (
              <ToolCard key={tool.href} item={tool} accent="amber" ctaLabel="Open tool" />
            ))}
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="flex items-center gap-4 mb-10">
          <span className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300/40 to-transparent" />
          <span className="text-amber-400/60 dark:text-amber-600/40 text-xs tracking-widest uppercase">Local Picks</span>
          <span className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300/40 to-transparent" />
        </div>

        {/* ── Local gems section ── */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-5">
            <span className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center text-orange-600 dark:text-orange-400">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </span>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Local Gems &middot; Seattle
            </h2>
          </div>
          <div className="space-y-3">
            {businesses.map((biz) => (
              <div
                key={biz.name}
                className="group p-5 rounded-2xl border border-orange-200/70 dark:border-orange-900/40
                  bg-white/80 dark:bg-card/80 backdrop-blur-sm
                  hover:shadow-lg hover:shadow-orange-100/40 dark:hover:shadow-orange-950/20
                  hover:border-orange-300 dark:hover:border-orange-700
                  transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  <span className="text-2xl shrink-0 mt-0.5">{biz.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-100/80 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400">
                        {biz.category}
                      </span>
                    </div>
                    <h3 className="font-semibold text-base">
                      {biz.url ? (
                        <a href={biz.url} target="_blank" rel="noopener noreferrer" className="text-amber-700 dark:text-amber-400 hover:underline underline-offset-2">
                          {biz.name} &rarr;
                        </a>
                      ) : biz.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{biz.desc}</p>
                    {biz.phone && (
                      <p className="text-sm mt-1.5 text-muted-foreground flex items-center gap-1.5">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                        {biz.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Feedback ── */}
        <div className="mb-10">
          <UsefulnessFeedback
            page="tools"
            prompt="Was this page helpful?"
            helper="One click helps us build more free tools you'll actually use."
          />
        </div>

        {/* ── Footer accent ── */}
        <div className="text-center pb-8">
          <p className="text-xs text-muted-foreground/50">More tools coming soon.</p>
        </div>
      </div>
    </article>
  );
}
