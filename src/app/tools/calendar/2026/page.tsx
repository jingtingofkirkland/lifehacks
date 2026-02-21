'use client';

import { useState } from 'react';
import { Stickers } from './stickers';
import { pickAnimal } from './animals';
import {
  HOLIDAYS, type Holiday, MONTH_NAMES, DAY_LABELS, DOT, BADGE,
  daysInMonth, startDay, dk,
} from './holidays';

/* ─────────────────── Page Component ─────────────────── */
export default function Calendar2026() {
  const YEAR = 2026;
  const [month, setMonth] = useState(new Date().getFullYear() === YEAR ? new Date().getMonth() : 0);
  const [showAnimals, setShowAnimals] = useState(true);
  const [view, setView] = useState<'month' | 'year'>('month');

  // Holiday lookup — multiple entries per date
  const hmap = new Map<string, Holiday[]>();
  HOLIDAYS.forEach(h => {
    const list = hmap.get(h.date) || [];
    list.push(h);
    hmap.set(h.date, list);
  });

  const today = new Date();
  const todayKey = dk(today.getFullYear(), today.getMonth(), today.getDate());

  // Build grid for any month
  function buildWeeks(m: number) {
    const total = daysInMonth(YEAR, m);
    const off = startDay(YEAR, m);
    const wks: (number | null)[][] = [];
    let r: (number | null)[] = Array(off).fill(null);
    for (let d = 1; d <= total; d++) {
      r.push(d);
      if (r.length === 7) { wks.push(r); r = []; }
    }
    if (r.length) { while (r.length < 7) r.push(null); wks.push(r); }
    return wks;
  }

  // For month view
  const weeks = buildWeeks(month);
  const monthHols = HOLIDAYS.filter(h => parseInt(h.date.split('-')[1], 10) - 1 === month);

  const prev = () => setMonth(m => Math.max(0, m - 1));
  const next = () => setMonth(m => Math.min(11, m + 1));

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 via-background to-background dark:from-amber-950/15 dark:via-background dark:to-background text-foreground relative overflow-hidden">
      {/* ── Subtle background accents (hidden on print) ── */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-amber-200/15 dark:bg-amber-800/5 rounded-full blur-3xl pointer-events-none print:hidden" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-200/10 dark:bg-orange-900/5 rounded-full blur-3xl pointer-events-none print:hidden" />

      {/* ── Header ── */}
      <header className="print:hidden sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border/60">
        <div className="max-w-5xl mx-auto px-4 py-2 lg:py-3 lg:flex lg:items-center lg:justify-between">
          {/* top row: nav + title */}
          <div className="flex items-center justify-between">
            <a href="/tools" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors group">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform"><path d="M15 18l-6-6 6-6"/></svg>
              Tools
            </a>
            <h1 className="text-lg font-semibold bg-gradient-to-r from-amber-700 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">{YEAR} Calendar</h1>
            <span className="w-12 lg:hidden" />
          </div>
          {/* second row on < lg, inline on lg+ */}
          <div className="flex items-center justify-center gap-1.5 mt-2 lg:mt-0">
            <button
              onClick={() => setView(v => v === 'month' ? 'year' : 'month')}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${view === 'year' ? 'border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-700' : 'border-border hover:bg-accent'}`}
            >
              {view === 'year' ? 'Year' : 'Month'}
            </button>
            <button
              onClick={() => setShowAnimals(v => !v)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${showAnimals ? 'border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-700' : 'border-border hover:bg-accent'}`}
            >
              {showAnimals ? 'Pets On' : 'Pets Off'}
            </button>
            <button onClick={() => {
              if (typeof window !== 'undefined' && typeof (window as any).fbq === 'function') {
                (window as any).fbq('trackCustom', 'CalendarPrint', { view, month: MONTH_NAMES[month] });
              }
              window.print();
            }} className="text-xs px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-700 dark:hover:bg-amber-600 transition-colors">
              Print
            </button>
          </div>
        </div>
      </header>

      <main className="relative max-w-5xl mx-auto px-4 py-6 print:px-2 print:py-2 print:max-w-none">

        {/* ═══════════════ YEAR VIEW ═══════════════ */}
        {view === 'year' && (
          <>
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 print:text-2xl print:mb-4">{YEAR} Year at a Glance</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 print:grid-cols-3 print:gap-3">
              {MONTH_NAMES.map((mName, mi) => {
                const mWeeks = buildWeeks(mi);
                const mHols = HOLIDAYS.filter(h => parseInt(h.date.split('-')[1], 10) - 1 === mi);
                return (
                  <div key={mName} className="print:break-inside-avoid">
                    <h3
                      className="text-sm font-bold mb-1 text-center cursor-pointer hover:text-primary transition-colors print:cursor-default print:text-xs"
                      onClick={() => { setView('month'); setMonth(mi); }}
                    >
                      {mName}
                    </h3>
                    {/* mini grid */}
                    <div className="border border-border rounded print:rounded-none print:border-gray-400 text-[10px] print:text-[8px]">
                      {/* day headers */}
                      <div className="grid grid-cols-7 bg-muted/60 print:bg-gray-100">
                        {['S','M','T','W','T','F','S'].map((d, i) => (
                          <div key={d + i} className={`text-center py-0.5 font-semibold ${i === 0 || i === 6 ? 'text-destructive' : ''}`}>{d}</div>
                        ))}
                      </div>
                      {/* weeks */}
                      {mWeeks.map((w, wi) => (
                        <div key={wi} className="grid grid-cols-7">
                          {w.map((day, di) => {
                            if (day === null) return <div key={di} className="py-0.5" />;
                            const key = dk(YEAR, mi, day);
                            const entries = hmap.get(key) || [];
                            const hol = entries.find(e => e.type !== 'bsd');
                            const bsd = entries.find(e => e.type === 'bsd');
                            const isWe = di === 0 || di === 6;
                            const isToday = key === todayKey;
                            return (
                              <div key={di} className={`text-center py-0.5 relative ${
                                isWe ? 'bg-blue-100/40 dark:bg-blue-950/20' : ''
                              } ${hol?.dayOff ? 'bg-rose-100/60 dark:bg-rose-950/20' : ''} ${!hol && bsd ? 'bg-amber-100/70 dark:bg-amber-900/25' : ''}`}>
                                <span className={`
                                  ${isWe ? 'text-destructive' : ''}
                                  ${isToday ? 'bg-primary text-primary-foreground rounded-full px-1' : ''}
                                  ${hol?.dayOff ? 'font-bold' : ''}
                                `}>
                                  {day}
                                </span>
                                {hol && <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${DOT[hol.color] ?? 'bg-gray-400'}`} />}
                                {!hol && bsd && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-500" />}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                    {/* mini legend */}
                    {mHols.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {mHols.filter(h => h.type !== 'bsd').map(h => (
                          <span key={h.date} className="inline-flex items-center gap-0.5 text-[9px] print:text-[7px] text-muted-foreground">
                            <span className={`w-1.5 h-1.5 rounded-full ${DOT[h.color] ?? 'bg-gray-400'}`} />
                            {h.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ═══════════════ MONTH VIEW ═══════════════ */}
        {view === 'month' && (
          <>
            {/* ── Month nav ── */}
            <nav className="print:hidden flex items-center justify-between mb-4">
              <button onClick={prev} disabled={month === 0} className="p-2 rounded-md hover:bg-accent disabled:opacity-30 transition-colors" aria-label="Previous month">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <div className="flex flex-wrap justify-center gap-1">
                {MONTH_NAMES.map((n, i) => (
                  <button key={n} onClick={() => setMonth(i)}
                    className={`text-xs px-2 py-1 rounded-md transition-colors ${i === month ? 'bg-primary text-primary-foreground' : 'hover:bg-accent text-muted-foreground'}`}>
                    {n.slice(0, 3)}
                  </button>
                ))}
              </div>
              <button onClick={next} disabled={month === 11} className="p-2 rounded-md hover:bg-accent disabled:opacity-30 transition-colors" aria-label="Next month">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </nav>

            {/* ── Month title ── */}
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 print:text-3xl print:mb-3">
              {MONTH_NAMES[month]} {YEAR}
            </h2>

            {/* ── Grid ── */}
            <div className="border border-border rounded-lg overflow-hidden print:rounded-none print:border-gray-400">
              {/* day headers */}
              <div className="grid grid-cols-7 bg-muted print:bg-gray-100">
                {DAY_LABELS.map((d, i) => (
                  <div key={d} className={`text-center text-xs sm:text-sm font-semibold py-2 border-b border-border print:border-gray-400 ${i === 0 || i === 6 ? 'text-destructive' : ''}`}>
                    {d}
                  </div>
                ))}
              </div>

              {/* week rows */}
              {weeks.map((w, wi) => (
                <div key={wi} className="grid grid-cols-7">
                  {w.map((day, di) => {
                    if (day === null)
                      return <div key={di} className="border-b border-r border-border print:border-gray-400 min-h-[3.5rem] sm:min-h-[5.5rem] print:min-h-[5rem] bg-muted/50" />;

                    const key = dk(YEAR, month, day);
                    const entries = hmap.get(key) || [];
                    const hol = entries.find(e => e.type !== 'bsd');
                    const bsd = entries.find(e => e.type === 'bsd');
                    const isWe = di === 0 || di === 6;
                    const isToday = key === todayKey;

                    return (
                      <div key={di} className={`
                        relative border-b border-r border-border print:border-gray-400
                        min-h-[3.5rem] sm:min-h-[5.5rem] print:min-h-[5rem]
                        p-1 sm:p-1.5 flex flex-col
                        ${isWe ? 'bg-blue-100/60 dark:bg-blue-950/30 print:bg-gray-100' : ''}
                        ${hol?.dayOff ? 'bg-rose-50/80 dark:bg-rose-950/25 border-l-2 border-l-rose-400 dark:border-l-rose-600 print:bg-rose-50' : ''}
                        ${!hol && bsd ? 'bg-amber-100/80 dark:bg-amber-900/30 border-l-2 border-l-amber-400 dark:border-l-amber-600 print:bg-amber-50' : ''}
                      `}>
                        {/* day number */}
                        <span className={`
                          text-xs sm:text-sm font-medium leading-none z-10
                          ${isWe ? 'text-destructive' : ''}
                          ${isToday ? 'bg-primary text-primary-foreground rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center print:border print:border-black print:bg-transparent print:text-black' : ''}
                        `}>
                          {day}
                        </span>

                        {/* sticker (from US holiday) */}
                        {hol?.sticker && (
                          <div className="absolute bottom-0 right-0 sm:bottom-0.5 sm:right-0.5 opacity-80 print:opacity-100 pointer-events-none">
                            <span className="hidden sm:block">{Stickers[hol.sticker](30)}</span>
                            <span className="sm:hidden">{Stickers[hol.sticker](20)}</span>
                          </div>
                        )}

                        {/* labels */}
                        <div className="mt-auto flex flex-col gap-0 z-10">
                          {hol && (
                            <span className={`text-[8px] sm:text-[10px] leading-tight font-medium truncate ${isWe ? 'text-destructive' : 'text-foreground'}`}>
                              <span className={`inline-block w-1.5 h-1.5 rounded-full mr-0.5 align-middle ${DOT[hol.color] ?? 'bg-gray-400'} print:bg-black`} />
                              {hol.name}
                            </span>
                          )}
                          {bsd && (
                            <span className="text-[7px] sm:text-[9px] leading-tight font-semibold truncate text-amber-800 dark:text-amber-300">
                              <span className="inline-block w-1.5 h-1.5 rounded-full mr-0.5 align-middle bg-amber-500 print:bg-gray-600" />
                              {bsd.name}
                            </span>
                          )}
                        </div>

                        {/* cute animal on empty cells */}
                        {showAnimals && !hol && !bsd && (
                          <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none print:opacity-30">
                            <span className="hidden sm:block">{pickAnimal(month, day)(40)}</span>
                            <span className="sm:hidden">{pickAnimal(month, day)(28)}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* ── Legend ── */}
            {monthHols.length > 0 && (
              <div className="mt-4 print:mt-3">
                <h3 className="text-sm font-semibold mb-2">Holidays & Events this month</h3>
                <div className="flex flex-wrap gap-2">
                  {monthHols.map(h => (
                    <span key={h.date + h.name} className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${
                      h.type === 'bsd'
                        ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-700'
                        : (BADGE[h.color] ?? '')
                    } print:border-gray-400 print:bg-transparent print:text-black`}>
                      {h.sticker && <span className="w-4 h-4 shrink-0 flex items-center">{Stickers[h.sticker](16)}</span>}
                      <span className={`w-2 h-2 rounded-full shrink-0 ${DOT[h.color] ?? 'bg-gray-400'} print:bg-black`} />
                      {h.name}
                      <span className="text-[10px] opacity-70">({h.date.slice(5)})</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* ── Print styles ── */}
      <style jsx global>{`
        @media print {
          body { background: white !important; color: black !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print\\:hidden, header, nav { display: none !important; }
          @page { margin: 0.4in; size: ${view === 'year' ? 'portrait' : 'landscape'}; }
        }
      `}</style>
    </div>
  );
}
