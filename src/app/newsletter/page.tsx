import type { Metadata } from 'next';
import Link from 'next/link';
import { NewsletterForm } from '@/components/NewsletterForm';

export const metadata: Metadata = {
  title: 'Weekly Math Worksheet Newsletter - Great Seattle Life Hacks',
  description:
    'One email every Friday — hand-picked math problems, a printable worksheet, and a peek at next week. Free, no spam, unsubscribe anytime.',
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

/**
 * Newsletter signup page (MVP): collects parent emails for the weekly
 * worksheet email. The form itself is a Tally embed configured later via
 * NEXT_PUBLIC_TALLY_FORM_URL; until then a placeholder is shown.
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
      <p className="text-muted-foreground mb-8 leading-relaxed">
        One email every Friday — hand-picked problems, a printable worksheet,
        and a peek at next week. Free, no spam, unsubscribe anytime.
      </p>

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

      <h2 className="text-xl font-bold mb-4">Subscribe</h2>
      <NewsletterForm />
      <p className="text-xs text-muted-foreground mt-4">
        We&apos;ll only email you the weekly worksheet. Unsubscribe anytime
        with one click.
      </p>
    </div>
  );
}
