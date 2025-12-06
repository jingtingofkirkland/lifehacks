import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Product Shares - Great Seattle Life Hacks',
};

const deals = [
  { title: "JONATHAN Y Area Rug", desc: "5x8 Easy-Cleaning - $29.5", url: "https://www.amazon.com/dp/B081D85TH9?tag=zeeyproducts-20" },
  { title: "Kids Electric Brush", desc: "$8.79 for 2!", url: "https://www.amazon.com/Amazon-Basics-Battery-Powered-Toothbrush/dp/B08QWYFP2R/?tag=zeeyproducts-20" },
  { title: "Vent Cleaner", desc: "$8.99 - 40% OFF", url: "https://www.amazon.com/dp/B08SBQBF2R?tag=zeeyproducts-20" },
  { title: "Lego on Sale", desc: "Lots of Lego deals!", url: "https://www.amazon.com/stores/page/077D4C49-D51B-4986-A5EC-DCAF277B1704?tag=zeeyproducts-20" },
];

export default function SharePage() {
  return (
    <article className="container max-w-3xl mx-auto px-4 py-8">
      <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
        ← Back to Home
      </Link>

      <h1 className="text-3xl font-bold mt-6 mb-4">Product Shares</h1>
      <p className="text-muted-foreground mb-8">Great deals we&apos;d like to share with you.</p>

      <div className="grid gap-4 sm:grid-cols-2">
        {deals.map((deal) => (
          <a key={deal.url} href={deal.url} target="_blank" rel="noopener noreferrer"
             className="block p-4 rounded-lg border hover:border-primary transition-colors">
            <h3 className="font-semibold text-primary">{deal.title}</h3>
            <p className="text-sm text-muted-foreground">{deal.desc}</p>
          </a>
        ))}
      </div>
    </article>
  );
}
