import type { Metadata } from 'next';
import Script from 'next/script';
import { Poppins, Inter, Roboto_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeToggle } from '@/components/ThemeToggle';
import { FeedbackButton } from '@/components/FeedbackButton';
import { siteConfig } from '@/config/site';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: siteConfig.title,
  description: 'Great Seattle Life Hacks - Local businesses, services, and deals in Seattle',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${poppins.variable} ${inter.variable} ${robotoMono.variable}`}>
      <head>
        {/* Meta Pixel Code */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '337570375319394');

            function getPageName() {
              var path = window.location.pathname.replace(/^\\/|\\/$/, '');
              return path || 'home';
            }

            // Capture UTM params from landing URL (last-touch, session-scoped)
            var UTM_KEYS = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'];
            function captureUtm() {
              try {
                var q = new URLSearchParams(window.location.search);
                var utm = {};
                UTM_KEYS.forEach(function(k){
                  var v = q.get(k);
                  if (v) utm[k.slice(4)] = v;
                });
                if (Object.keys(utm).length) {
                  try { sessionStorage.setItem('utm', JSON.stringify(utm)); } catch(e){}
                  return utm;
                }
              } catch(e){}
              return null;
            }
            function getStoredUtm() {
              try { return JSON.parse(sessionStorage.getItem('utm') || '{}'); } catch(e) { return {}; }
            }
            function withUtm(extra) {
              var stored = getStoredUtm();
              var out = { page: getPageName() };
              for (var k in stored) out[k] = stored[k];
              if (extra) for (var k2 in extra) out[k2] = extra[k2];
              return out;
            }
            window.__getStoredUtm = getStoredUtm;

            var landedUtm = captureUtm();
            fbq('track', 'PageView', withUtm());
            if (landedUtm) {
              fbq('trackCustom', 'AdLanding', withUtm(landedUtm));
            }

            // Track client-side navigations in Next.js
            var _pushState = history.pushState;
            history.pushState = function() {
              _pushState.apply(history, arguments);
              fbq('track', 'PageView', withUtm());
            };
          `}
        </Script>
        {/* End Meta Pixel Code */}
      </head>
      <body className="min-h-screen bg-background text-foreground">
        {/* Meta Pixel noscript fallback — uses dangerouslySetInnerHTML to
            prevent Next.js from detecting the <img> and generating a
            <link rel="preload"> that fires the pixel even with JS enabled */}
        <noscript dangerouslySetInnerHTML={{ __html: '<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=337570375319394&ev=PageView&noscript=1" />' }} />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeToggle />
          {children}
          <FeedbackButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
