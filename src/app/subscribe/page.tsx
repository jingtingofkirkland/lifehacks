'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function SubscribePage() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/thank-you');
  };

  return (
    <article className="container max-w-md mx-auto px-4 py-8">
      <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
        ← Back to Home
      </Link>

      <h1 className="text-3xl font-bold mt-6 mb-8">Subscribe</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">Email address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="w-full px-4 py-2 rounded-md border bg-background focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
        <Button type="submit" className="w-full">Subscribe</Button>
      </form>
    </article>
  );
}
