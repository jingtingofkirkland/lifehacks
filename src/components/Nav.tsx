import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface NavItem {
  title: string;
  url: string;
}

export function NavLinks({ items }: { items: NavItem[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {items.map((item) => (
        item.url.startsWith('http') ? (
          <a
            key={item.url}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full bg-card shadow-sm hover:bg-primary hover:text-primary-foreground hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 text-sm font-medium"
          >
            {item.title}
          </a>
        ) : (
          <Link
            key={item.url}
            href={item.url}
            className="px-4 py-2 rounded-full bg-card shadow-sm hover:bg-primary hover:text-primary-foreground hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 text-sm font-medium"
          >
            {item.title}
          </Link>
        )
      ))}
    </div>
  );
}

export function Header({ navItems }: { navItems: NavItem[] }) {
  return (
    <nav className="py-4 mb-6">
      <NavLinks items={navItems} />
    </nav>
  );
}

export function Footer({ items, author }: { items: NavItem[], author: string }) {
  return (
    <footer className="relative mt-20 pt-12 pb-8">
      {/* Wave SVG */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-8">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor" className="text-muted/30"></path>
        </svg>
      </div>

      <div className="bg-gradient-to-t from-muted/50 to-transparent pt-8">
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {items.map((item) => (
            item.url.startsWith('http') ? (
              <a
                key={item.url}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-card shadow-sm hover:bg-primary hover:text-primary-foreground hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 text-sm font-medium"
              >
                {item.title}
              </a>
            ) : (
              <Link
                key={item.url}
                href={item.url}
                className="px-4 py-2 rounded-full bg-card shadow-sm hover:bg-primary hover:text-primary-foreground hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 text-sm font-medium"
              >
                {item.title}
              </Link>
            )
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {author}
        </p>
      </div>
    </footer>
  );
}
