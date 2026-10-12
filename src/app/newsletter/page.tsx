import type { Metadata } from 'next';
import Link from 'next/link';
import { NewsletterForm } from '@/components/NewsletterForm';

export const metadata: Metadata = {
  title: 'Weekly Math Worksheet Newsletter - Great Seattle Life Hacks',
  description:
    'One email every Friday — 3 new Kangaroo-style problems, a printable worksheet, and a peek at next week. Subscribe free and get the complete 40-problem printable pack.',
  alternates: {
    canonical: 'https://lifehacks.zeey-app.net/newsletter/',
  },
};

const WHATS_INSIDE = [
  {
    emoji: '📝',
    title: "This week's best problems",
    body: 'Hand-picked from the daily problem series — the ones kids loved most.',
  },
  {
    emoji: '🖨️',
    title: 'Printable worksheet',
    body: 'A fresh practice sheet to print and take anywhere. No sign-up needed to play online.',
  },
  {
    emoji: '🔭',
    title: 'Next week preview',
    body: "A peek at what's coming up, so you can plan practice around your week.",
  },
];

const SAMPLE_PROBLEMS = [
  {
    tag: '🌼 Patterns · 3 pts',
    body: 'Mia plants flowers in a repeating pattern — 3 red, 2 yellow, 3 red, 2 yellow… If she plants 20 flowers in a row, how many are yellow? Hint: think in groups of 5.',
  },
  {
    tag: '🍪 Two-step word problem · 4 pts',
    body: '36 cookies are shared equally among 4 kids, then each kid eats 2 of their own. How many does each kid have left?',
  },
  {
    tag: '🎫 The challenge · 5 pts',
    body: 'Emma gave away half of her stickers, then gave away 4 more. Now she has 6 left. How many did she start with? Try thinking backwards!',
  },
];

const FAQS = [
  {
    q: 'Is it really free?',
    a: 'Yes — completely free. No account, no card, no catch. We make the problems for our own kid and share them with families like yours.',
  },
  {
    q: 'How often will I hear from you?',
    a: 'One email every Friday, and that is it. No daily nagging, no marketing blasts in between.',
  },
  {
    q: 'How do I unsubscribe?',
    a: 'Just reply "unsubscribe" to any issue and we will take you off the list right away — no hard feelings.',
  },
];

/**
 * Newsletter signup landing page (Top 2 rebuild, 2026-10-12): one clear
 * promise up top, the 40-problem printable pack as the signup gift, a
 * taste of Issue 1, then the form and a short FAQ. The form itself is a
 * Tally embed (see NewsletterForm); while no URL is configured the page
 * shows an honest placeholder instead of a fake form.
 */
export default function NewsletterPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-6">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-foreground font-medium">
            Newsletter
          </li>
        </ol>
      </nav>

      <h1 className="text-3xl font-bold mb-3">
        Weekly Math Worksheet Newsletter
      </h1>
      <p className="text-lg leading-relaxed mb-8">
        One email every Friday — one fun Kangaroo-style problem set in your
        inbox, with a printable worksheet and a peek at next week. Free, no
        spam, unsubscribe anytime.
      </p>

      {/* Lead magnet: the 40-problem printable pack */}
      <div className="rounded-2xl border border-emerald-300/80 dark:border-emerald-700/50 bg-gradient-to-br from-emerald-100/80 to-teal-50/70 dark:from-emerald-950/50 dark:to-teal-950/30 p-6 mb-10">
        <p className="font-bold text-lg mb-1">
          🎁 Subscribe and get the complete printable pack
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Your first Friday email includes the full 40-problem printable
          pack — every problem in our Kangaroo-style library, with answers
          and step-by-step explanations, ready to print for the fridge or
          the classroom.
        </p>
        <Link
          href="/practice/kangaroo/grade-3/"
          className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 hover:underline"
        >
          Peek at the problems now →
        </Link>
      </div>

      <h2 className="text-xl font-bold mb-4">What&apos;s inside</h2>
      <ul className="grid gap-4 sm:grid-cols-3 mb-8">
        {WHATS_INSIDE.map((item) => (
          <li
            key={item.title}
            className="rounded-2xl border border-slate-200 dark:border-slate-700 p-5"
          >
            <p className="text-2xl mb-2" aria-hidden>
              {item.emoji}
            </p>
            <p className="font-semibold mb-1">{item.title}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {item.body}
            </p>
          </li>
        ))}
      </ul>
      <p className="text-sm text-muted-foreground mb-10">
        🦘 Bonus during contest season: a Kangaroo countdown series in the
        weeks before the competition.
      </p>

      {/* Sample issue preview: a taste of Issue 1 before subscribing */}
      <h2 className="text-xl font-bold mb-4">A taste of Issue 1</h2>
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-card/70 p-6 mb-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
          Weekly Worksheet · Issue 1
        </p>
        <p className="font-bold mb-4">Patterns + Reverse Thinking 🦘</p>
        <div className="space-y-4">
          {SAMPLE_PROBLEMS.map((p) => (
            <div key={p.tag}>
              <p className="text-sm font-semibold mb-1">{p.tag}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {p.body}
              </p>
            </div>
          ))}
        </div>
        <Link
          href="/tools/kangaroo/"
          className="inline-block mt-5 text-sm font-semibold text-emerald-700 dark:text-emerald-300 hover:underline"
        >
          Play these online and see the answers →
        </Link>
      </div>

      <h2 className="text-xl font-bold mb-4">Get the pack + the weekly worksheet</h2>
      <NewsletterForm />
      <p className="text-xs text-muted-foreground mt-4 mb-10">
        We&apos;ll only email you the weekly worksheet. Unsubscribe anytime
        with one click.
      </p>

      <h2 className="text-xl font-bold mb-4">Questions</h2>
      <div className="space-y-4 mb-8">
        {FAQS.map((faq) => (
          <section
            key={faq.q}
            className="rounded-2xl border border-slate-200 dark:border-slate-700 p-5"
          >
            <p className="font-semibold mb-1">{faq.q}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {faq.a}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
