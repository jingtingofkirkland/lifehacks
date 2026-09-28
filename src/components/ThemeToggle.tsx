'use client';

import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  // Embed pages (e.g. /embed/math-addition/) are iframed on partner sites:
  // no floating site chrome there.
  if (pathname?.startsWith('/embed/')) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="fixed right-4 top-4 z-50 print:hidden"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
