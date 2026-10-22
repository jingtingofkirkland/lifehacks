import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getPostContent } from '@/lib/posts';
import NeuralJumpDemo from './NeuralJumpDemo';
import ArticleBody from './ArticleBody';

export const metadata: Metadata = {
  title:
    'A Hand-Built Neural Network Learns to Jump Stairs — Playable Demo | Great Seattle Life Hacks',
  description:
    'Watch a tiny hand-written neural network (43 numbers, no ML libraries, no backpropagation) teach itself to jump three stairs using a genetic algorithm. Play with the live demo, then read how the fitness function, selection, and mutation actually work.',
  alternates: {
    canonical: 'https://lifehacks.zeey-app.net/tech/neural-network-learns-to-jump/',
  },
};

/**
 * /tech/neural-network-learns-to-jump/
 *
 * A playable article: the live genetic-algorithm jumping demo on top,
 * a full bilingual explainer below it. The article text lives in
 * data/posts/neural-network-learns-to-jump.en.md (primary) and
 * data/posts/neural-network-learns-to-jump.md (中文）, loaded through
 * the same posts helper as the rest of /tech/.
 */
export default async function NeuralNetworkJumpPage() {
  const [contentEn, contentZh] = await Promise.all([
    getPostContent('neural-network-learns-to-jump.en.md'),
    getPostContent('neural-network-learns-to-jump.md'),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-16">
        <Link
          href="/tech/"
          className="inline-flex items-center text-white/60 hover:text-white transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to AI Techs
        </Link>

        <header className="mb-8 max-w-3xl">
          <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-500/20 text-blue-300 rounded-full mb-4">
            AI · Interactive 互动
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            A Hand-Built Neural Network Learns to Jump Stairs
          </h1>
          <p className="text-lg text-white/60 leading-relaxed">
            手搓神经网络学跳台阶 — a stick figure, a tiny neural network of 43
            numbers, and a genetic algorithm. No ML libraries, no backpropagation,
            no preset answers. Press start and watch it figure out
            left&nbsp;→ right&nbsp;→ right on its own.
          </p>
        </header>

        <section aria-label="Playable demo" className="mb-14">
          <NeuralJumpDemo />
        </section>

        <section aria-label="Article" className="max-w-3xl">
          {contentEn && contentZh ? (
            <ArticleBody contentEn={contentEn} contentZh={contentZh} />
          ) : (
            <p className="text-white/60">Article content is unavailable right now.</p>
          )}
        </section>
      </div>

      <footer className="border-t border-white/10 py-8">
        <div className="container max-w-6xl mx-auto px-6 text-center">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} Great Seattle Life Hacks
          </p>
        </div>
      </footer>
    </div>
  );
}
