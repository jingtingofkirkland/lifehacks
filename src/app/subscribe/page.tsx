import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  alternates: { canonical: 'https://lifehacks.zeey-app.net/newsletter/' },
};

const TARGET = '/newsletter/';

/**
 * /subscribe/ used to be a fake form: submissions were never stored, they
 * just routed to /thank-you. The real signup lives on /newsletter/, so this
 * page now only redirects there. The site is a static export (no HTTP
 * redirects on GitHub Pages), so the redirect is delivered as an instant
 * meta-refresh + JS replace — the same pattern as public/landing.html —
 * with a plain link as fallback for clients that run neither.
 */
export default function SubscribeRedirectPage() {
  return (
    <article className="container max-w-md mx-auto px-4 py-8">
      <meta httpEquiv="refresh" content={`0; url=${TARGET}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.replace(${JSON.stringify(TARGET)});`,
        }}
      />
      <h1 className="text-3xl font-bold mt-6 mb-4">We&rsquo;ve moved!</h1>
      <p className="text-muted-foreground">
        Newsletter signup now lives on our newsletter page. You should be
        redirected automatically — if not,{' '}
        <Link href={TARGET} className="underline text-primary">
          continue to the newsletter signup →
        </Link>
      </p>
    </article>
  );
}
