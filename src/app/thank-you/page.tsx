import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thank You - Great Seattle Life Hacks',
};

export default function ThankYouPage() {
  return (
    <article className="container max-w-md mx-auto px-4 py-8 text-center">
      <div className="text-5xl mb-4">✅</div>
      <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
      <p className="text-muted-foreground mb-6">Thanks for subscribing.</p>

      <div className="space-y-2 mb-8">
        <p className="font-medium">Follow us:</p>
        <div className="flex justify-center gap-4">
          <a href="https://www.youtube.com/@zeey5475" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">YouTube</a>
          <a href="https://twitter.com/ZeeyHow" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Twitter</a>
        </div>
      </div>

      <Link href="/" className="text-sm text-muted-foreground hover:text-primary">← Back to Home</Link>
    </article>
  );
}
