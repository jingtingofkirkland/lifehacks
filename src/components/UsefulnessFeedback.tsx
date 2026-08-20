'use client';

import { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

type Variant = 'default' | 'dark';

interface Props {
  page: string;
  variant?: Variant;
  prompt?: string;
  className?: string;
}

const STYLES: Record<Variant, {
  wrap: string;
  prompt: string;
  btn: string;
  btnUseful: string;
  btnNotUseful: string;
  activeUseful: string;
  activeNotUseful: string;
  thanks: string;
}> = {
  default: {
    wrap: 'border-amber-200/70 dark:border-amber-900/40 bg-white/80 dark:bg-card/80',
    prompt: 'text-muted-foreground',
    btn: 'border border-amber-200/80 dark:border-amber-800/50 bg-white/60 dark:bg-background/40 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40',
    btnUseful: '',
    btnNotUseful: '',
    activeUseful: 'bg-emerald-500 border-emerald-500 text-white hover:bg-emerald-500',
    activeNotUseful: 'bg-rose-500 border-rose-500 text-white hover:bg-rose-500',
    thanks: 'text-emerald-600 dark:text-emerald-400',
  },
  dark: {
    wrap: 'border-slate-700 bg-slate-800/40',
    prompt: 'text-slate-400',
    btn: 'border border-slate-600 bg-slate-700/50 text-slate-300 hover:bg-slate-600/60 hover:text-white',
    btnUseful: '',
    btnNotUseful: '',
    activeUseful: 'bg-cyan-500 border-cyan-400 text-white hover:bg-cyan-500',
    activeNotUseful: 'bg-rose-500 border-rose-400 text-white hover:bg-rose-500',
    thanks: 'text-cyan-300',
  },
};

export function UsefulnessFeedback({
  page,
  variant = 'default',
  prompt = 'Was this useful?',
  className = '',
}: Props) {
  const [voted, setVoted] = useState<'useful' | 'not_useful' | null>(null);
  const s = STYLES[variant];

  const submit = (rating: 'useful' | 'not_useful') => {
    if (voted) return;
    setVoted(rating);
    if (typeof window !== 'undefined' && typeof (window as any).fbq === 'function') {
      (window as any).fbq('trackCustom', 'ContentFeedback', { page, rating });
    }
  };

  return (
    <div
      className={`rounded-2xl border backdrop-blur-sm px-5 py-4 flex flex-wrap items-center justify-center gap-3 ${s.wrap} ${className}`}
      role="group"
      aria-label="Content feedback"
    >
      <span className={`text-sm font-medium ${s.prompt}`}>{prompt}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => submit('useful')}
          disabled={!!voted}
          aria-pressed={voted === 'useful'}
          aria-label="Mark as useful"
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 disabled:cursor-default ${
            voted === 'useful' ? s.activeUseful : s.btn
          } ${voted && voted !== 'useful' ? 'opacity-40' : ''}`}
        >
          <ThumbsUp className="h-3.5 w-3.5" />
          Useful
        </button>
        <button
          type="button"
          onClick={() => submit('not_useful')}
          disabled={!!voted}
          aria-pressed={voted === 'not_useful'}
          aria-label="Mark as not useful"
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 disabled:cursor-default ${
            voted === 'not_useful' ? s.activeNotUseful : s.btn
          } ${voted && voted !== 'not_useful' ? 'opacity-40' : ''}`}
        >
          <ThumbsDown className="h-3.5 w-3.5" />
          Not useful
        </button>
      </div>
      {voted && (
        <span className={`text-xs font-medium ${s.thanks}`}>Thanks for the feedback!</span>
      )}
    </div>
  );
}
