'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface ArticleBodyProps {
  contentEn: string;
  contentZh: string;
}

/**
 * Bilingual article body for the neural-network explainer page.
 * English is the primary version; the toggle mirrors the /tech/ PostCard
 * convention （中文 / English) so readers can switch in place.
 */
export default function ArticleBody({ contentEn, contentZh }: ArticleBodyProps) {
  const [lang, setLang] = useState<'en' | 'zh'>('en');
  const active = lang === 'en' ? contentEn : contentZh;

  return (
    <div>
      <div className="flex items-center justify-end gap-2 mb-6">
        <span className="text-xs text-white/40 mr-1">双语全文 · Bilingual</span>
        <button
          type="button"
          onClick={() => setLang('en')}
          aria-pressed={lang === 'en'}
          className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-300 ${
            lang === 'en'
              ? 'bg-white text-slate-900'
              : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10'
          }`}
        >
          English
        </button>
        <button
          type="button"
          onClick={() => setLang('zh')}
          aria-pressed={lang === 'zh'}
          className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-300 ${
            lang === 'zh'
              ? 'bg-white text-slate-900'
              : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10'
          }`}
        >
          中文
        </button>
      </div>
      <div className="prose prose-invert prose-blue max-w-none prose-headings:scroll-mt-24 prose-table:text-sm">
        <ReactMarkdown>{active}</ReactMarkdown>
      </div>
    </div>
  );
}
