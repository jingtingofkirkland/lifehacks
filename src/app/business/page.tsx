import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Business Shares - Great Seattle Life Hacks',
};

const businesses = [
  { name: 'Sky Tree Service', category: 'Tree Removal', desc: 'Professional and budget-friendly Seattle local tree removal.', phone: '(206) 602-0070' },
  { name: 'Evangeline Yu', category: 'Insurance', desc: 'Very helpful and patient agent.', url: 'https://www.comparioninsurance.com/insurance-agent/washington/tukwila-0671/evangelineyu' },
  { name: 'Arco Glass', category: 'Window/Door', desc: 'Budget prices with good quality work.', phone: '(206) 226-0013' },
];

export default function BusinessPage() {
  return (
    <article className="container max-w-3xl mx-auto px-4 py-8">
      <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
        ← Back to Home
      </Link>

      <h1 className="text-3xl font-bold mt-6 mb-4">Business Shares</h1>
      <p className="text-muted-foreground mb-8">Great local businesses we recommend in the Seattle area.</p>

      <div className="space-y-4">
        {businesses.map((biz) => (
          <div key={biz.name} className="p-4 rounded-lg bg-muted/50">
            <div className="text-xs text-muted-foreground uppercase mb-1">{biz.category}</div>
            <h3 className="font-semibold">
              {biz.url ? (
                <a href={biz.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{biz.name}</a>
              ) : biz.name}
            </h3>
            <p className="text-sm text-muted-foreground">{biz.desc}</p>
            {biz.phone && <p className="text-sm mt-1">📞 {biz.phone}</p>}
          </div>
        ))}
      </div>
    </article>
  );
}
