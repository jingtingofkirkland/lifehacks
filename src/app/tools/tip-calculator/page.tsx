'use client';

import { useState } from 'react';
import Link from 'next/link';

const TIP_PRESETS = [15, 18, 20, 25];

export default function TipCalculatorPage() {
  const [bill, setBill] = useState('');
  const [tipPercent, setTipPercent] = useState(18);
  const [people, setPeople] = useState(1);

  const billAmount = parseFloat(bill) || 0;
  const tipAmount = billAmount * (tipPercent / 100);
  const total = billAmount + tipAmount;
  const perPerson = people > 0 ? total / people : total;

  return (
    <article className="min-h-screen bg-gradient-to-b from-emerald-50 via-background to-background dark:from-emerald-950/20 dark:via-background dark:to-background relative overflow-hidden">
      <div className="relative max-w-md mx-auto px-4 py-8">
        {/* Back link */}
        <Link href="/tools" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors group">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform"><path d="M15 18l-6-6 6-6"/></svg>
          Back to Tools
        </Link>

        {/* Header */}
        <div className="mt-8 mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-emerald-400/60" />
            <span className="text-emerald-500 dark:text-emerald-400 text-2xl">💰</span>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-emerald-400/60" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
            Tip Calculator
          </h1>
          <p className="text-muted-foreground text-sm">Split the bill, skip the math.</p>
        </div>

        {/* Calculator */}
        <div className="space-y-6">
          {/* Bill Amount */}
          <div>
            <label htmlFor="bill" className="block text-sm font-medium mb-2">Bill Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <input
                id="bill"
                type="number"
                min="0"
                step="0.01"
                value={bill}
                onChange={(e) => setBill(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-emerald-500 outline-none text-lg"
              />
            </div>
          </div>

          {/* Tip Percentage */}
          <div>
            <label className="block text-sm font-medium mb-2">Tip Percentage</label>
            <div className="flex gap-2 mb-3">
              {TIP_PRESETS.map((pct) => (
                <button
                  key={pct}
                  onClick={() => setTipPercent(pct)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    tipPercent === pct
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-muted hover:bg-accent border border-border'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={tipPercent}
              onChange={(e) => setTipPercent(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
            <div className="text-center text-sm text-muted-foreground mt-1">{tipPercent}%</div>
          </div>

          {/* Split */}
          <div>
            <label className="block text-sm font-medium mb-2">Split Between</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPeople(Math.max(1, people - 1))}
                className="w-10 h-10 rounded-lg bg-muted hover:bg-accent border border-border font-bold text-lg"
              >
                -
              </button>
              <span className="text-2xl font-bold min-w-[3rem] text-center">{people}</span>
              <button
                onClick={() => setPeople(people + 1)}
                className="w-10 h-10 rounded-lg bg-muted hover:bg-accent border border-border font-bold text-lg"
              >
                +
              </button>
              <span className="text-sm text-muted-foreground ml-1">{people === 1 ? 'person' : 'people'}</span>
            </div>
          </div>

          {/* Results */}
          {billAmount > 0 && (
            <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/50 dark:bg-emerald-950/20 p-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tip</span>
                <span className="font-medium">${tipAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total</span>
                <span className="font-medium">${total.toFixed(2)}</span>
              </div>
              {people > 1 && (
                <div className="border-t border-emerald-200 dark:border-emerald-800/40 pt-3 flex justify-between">
                  <span className="font-medium">Per Person</span>
                  <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">${perPerson.toFixed(2)}</span>
                </div>
              )}
              {people === 1 && (
                <div className="border-t border-emerald-200 dark:border-emerald-800/40 pt-3 flex justify-between">
                  <span className="font-medium">You Pay</span>
                  <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">${total.toFixed(2)}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="text-center pt-8 pb-4">
          <p className="text-xs text-muted-foreground/50">No data collected. Runs entirely in your browser.</p>
        </div>
      </div>
    </article>
  );
}
