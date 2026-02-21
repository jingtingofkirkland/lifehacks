import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Life Saver Tools - Great Seattle Life Hacks',
  description: 'Printable calendars, handy tools, and local gems to make everyday life easier.',
};

const tools = [
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
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group relative block p-6 rounded-2xl border border-amber-200/80 dark:border-amber-800/40
                  bg-white/80 dark:bg-card/80 backdrop-blur-sm
                  hover:shadow-xl hover:shadow-amber-200/40 dark:hover:shadow-amber-900/20
                  hover:border-amber-300 dark:hover:border-amber-600
                  hover:-translate-y-0.5
                  transition-all duration-300"
              >
                {/* tag */}
                {tool.tag && (
                  <span className="absolute top-3 right-3 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
                    {tool.tag}
                  </span>
                )}
                <div className="flex items-start gap-4">
                  <div className="shrink-0 mt-0.5 p-2 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 border border-amber-100 dark:border-amber-900/30 group-hover:scale-110 transition-transform duration-300">
                    {tool.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{tool.desc}</p>
                    <span className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-amber-600 dark:text-amber-400 group-hover:gap-2 transition-all">
                      Open tool
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </span>
                  </div>
                </div>
              </Link>
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

        {/* ── Footer accent ── */}
        <div className="text-center pb-8">
          <p className="text-xs text-muted-foreground/50">More tools coming soon.</p>
        </div>
      </div>
    </article>
  );
}
