import type { Metadata } from 'next';
import Link from 'next/link';
import { PrintStencilButton } from './PrintStencilButton';

export const metadata: Metadata = {
  title: 'Free Printable Pumpkin Carving Stencils for Kids - Great Seattle Life Hacks',
  description:
    'Three free printable pumpkin carving stencils for kids: a classic jack-o\'-lantern face, a friendly spider, and a flying bat. Print on A4 or US Letter, tape to the pumpkin, poke the outline, and carve.',
  alternates: {
    canonical: 'https://lifehacks.zeey-app.net/halloween/pumpkin-stencils/',
  },
};

const STENCILS = [
  {
    id: 'classic',
    name: "Classic Jack-o'-Lantern Face",
    difficulty: 'Easy',
    src: '/halloween/classic-face.svg',
    alt: "Classic jack-o'-lantern face stencil: triangle eyes, triangle nose, and a jagged toothy grin",
    blurb:
      'The timeless triangle eyes and toothy grin. Big shapes and forgiving lines — a perfect first pumpkin.',
  },
  {
    id: 'spider',
    name: 'Friendly Spider',
    difficulty: 'Easy',
    src: '/halloween/spider.svg',
    alt: 'Friendly spider stencil: a big round body with a round head and eight thick legs',
    blurb:
      'A round, friendly spider with eight chunky legs. Thick, sturdy shapes that will not tear thin pumpkin walls.',
  },
  {
    id: 'bat',
    name: 'Flying Bat',
    difficulty: 'Medium',
    src: '/halloween/bat.svg',
    alt: 'Flying bat stencil: a bat silhouette with scalloped wings and two pointy ears',
    blurb:
      'A swoopy bat with scalloped wings. A few more corners to follow — best with a patient grown-up helper.',
  },
];

/**
 * Free printable pumpkin carving stencils for kids. Cut-out areas use a
 * light diagonal hatch (saves printer ink) with a thick black outline,
 * instead of solid black fills. Each card's print button prints only that
 * stencil, large and centered (see the print CSS below), on A4 or Letter.
 */
export default function PumpkinStencilsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 10mm; }
          .stencil-sheet { break-inside: avoid; margin: 0 auto 12mm; }
          .stencil-sheet img { display: block; width: 168mm; max-width: 100%; height: auto; margin: 0 auto; }
          html[data-print-target="classic"] .stencil-sheet:not(.stencil-sheet--classic),
          html[data-print-target="spider"] .stencil-sheet:not(.stencil-sheet--spider),
          html[data-print-target="bat"] .stencil-sheet:not(.stencil-sheet--bat) { display: none !important; }
          html[data-print-target] .stencil-sheet { margin-bottom: 0; }
        }
      `}</style>

      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-6 print:hidden">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-foreground font-medium">
            Pumpkin Carving Stencils
          </li>
        </ol>
      </nav>

      <h1 className="text-3xl font-bold mb-3">Free Printable Pumpkin Carving Stencils for Kids</h1>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        Three big, bold patterns for little pumpkin artists. Print one, tape it to your
        pumpkin, poke along the outline, and carve. Easy on ink, easy on small hands.
      </p>
      <p className="mb-10 inline-block rounded-full bg-orange-100 dark:bg-orange-950/40 text-orange-900 dark:text-orange-200 text-sm font-medium px-4 py-1.5 print:hidden">
        🎃 Hatched area = the part you cut out
      </p>

      <section className="mb-12 print:hidden">
        <h2 className="text-xl font-bold mb-4">How to use a stencil</h2>
        <ol className="list-decimal list-outside ml-5 space-y-2 text-muted-foreground leading-relaxed">
          <li>
            <strong className="text-foreground">Print it.</strong> Print at 100%, or choose
            &ldquo;fit to page&rdquo;. Works on A4 and US Letter.
          </li>
          <li>
            <strong className="text-foreground">Tape it on.</strong> Tape the paper flat
            against the pumpkin, smoothing out wrinkles.
          </li>
          <li>
            <strong className="text-foreground">Poke the dots.</strong> With a pin or
            toothpick, poke dots all along the black outlines.
          </li>
          <li>
            <strong className="text-foreground">Carve along the dots.</strong> Take the paper
            off and cut out the hatched parts, following your dotted lines.
          </li>
          <li>
            <strong className="text-foreground">Light it up.</strong> Put an LED candle
            inside and watch your pumpkin glow.
          </li>
        </ol>
        <p className="mt-5 rounded-2xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30 px-4 py-3 text-sm leading-relaxed">
          ⚠️ <strong>Safety first:</strong> grown-ups do all the knife work. Kids pick the
          pattern, tape it on, poke the dots, and scoop out the pumpkin goop.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4 print:hidden">Pick your stencil</h2>
        <div className="grid gap-6">
          {STENCILS.map((s) => (
            <figure
              key={s.id}
              className={`stencil-sheet stencil-sheet--${s.id} rounded-2xl border border-slate-200 dark:border-slate-700 p-5 print:border-0 print:p-0`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- plain <img> keeps SVG print sizing exact */}
              <img src={s.src} alt={s.alt} className="w-full max-w-[480px] mx-auto print:max-w-none" />
              <figcaption className="mt-4 text-center print:hidden">
                <div className="font-bold">
                  {s.name}{' '}
                  <span className="ml-1 align-middle text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300">
                    {s.difficulty}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1 mb-3">{s.blurb}</p>
                <PrintStencilButton stencilId={s.id} />
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-6 print:hidden">
          Ink tip: these stencils use a light hatch pattern instead of solid black, so they
          print happily on the &ldquo;draft&rdquo; setting too. More free printables for kids:{' '}
          <Link href="/newsletter/" className="underline underline-offset-2">
            get our free weekly worksheet
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
