import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Latest Techs - Great Seattle Life Hacks',
};

export default function TechPage() {
  return (
    <article className="container max-w-3xl mx-auto px-4 py-8">
      <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
        ← Back to Home
      </Link>

      <h1 className="text-3xl font-bold mt-6 mb-8">Learn New Techs Everyday!</h1>

      <div className="space-y-8">
        <p className="text-muted-foreground">
          Sharing the latest articles about new tech, so you could understand what&apos;s happening daily.
        </p>

        <section>
          <h2 className="text-2xl font-semibold mb-4 pb-2 border-b">Space News</h2>
          <Link href="/space" className="text-primary hover:underline">
            SpaceX Falcon 9 Reuse Status →
          </Link>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 pb-2 border-b">Signals Gateway</h2>
          <p className="text-muted-foreground mb-4">
            <a href="https://www.facebook.com/business/m/signalsgateway/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Signals Gateway
            </a>{' '}
            by Meta is a Customer Data Platform (CDP) for collecting, managing, and distributing first-party data.
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
            <li>Centralized Data Management</li>
            <li>First-Party Data Tracking</li>
            <li>Easy Setup without coding</li>
            <li>GDPR Compliance built-in</li>
            <li>AI and Automation Support</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 pb-2 border-b">Gen AI</h2>
          <p className="text-muted-foreground mb-4">
            Generative AI creates new content including text, images, music, or video.
          </p>
          <h3 className="font-medium mb-2">Learning Resources:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li><a href="https://www.youtube.com/watch?v=T-D1OfcDW1M" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">What is RAG?</a></li>
            <li><a href="https://www.youtube.com/watch?v=JpQC0W91E6k" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Setup Your Own Offline AI</a></li>
          </ul>
        </section>
      </div>
    </article>
  );
}
