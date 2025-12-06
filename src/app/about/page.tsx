import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About - Great Seattle Life Hacks',
};

export default function AboutPage() {
  return (
    <article className="container max-w-3xl mx-auto px-4 py-8">
      <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
        ← Back to Home
      </Link>

      <h1 className="text-3xl font-bold mt-6 mb-8">About</h1>

      <div className="space-y-4 text-muted-foreground">
        <p>Welcome to Great Seattle Life Hacks!</p>
        <p>
          At Great Seattle Life Hacks, we understand the heartbeat of this city lies in its
          local businesses—the cozy cafes, the innovative startups, the family-run boutiques,
          and the service providers who make our city unique. Our mission is simple: to connect
          you with the best of Seattle, all in one place.
        </p>
        <p>
          Follow us on{' '}
          <a href="https://www.facebook.com/profile.php?id=61551909728667" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            Facebook
          </a>{' '}
          to get latest life hack information!
        </p>
        <p>Email us: austinhao2018@gmail.com</p>
      </div>
    </article>
  );
}
