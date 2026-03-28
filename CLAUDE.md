# CLAUDE.md - Great Seattle Life Hacks

## Project Overview

A Next.js 14 static site ("Great Seattle Life Hacks") deployed to GitHub Pages via custom domain `lifehacks.zeey-app.net`. The site combines local Seattle recommendations, space launch analytics, AI/tech articles, and printable tools (calendar).

## Tech Stack

- **Framework**: Next.js 14 with App Router, static export (`output: 'export'`)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 3.4 + shadcn/ui (Radix primitives) + CSS variables for theming
- **Fonts**: Poppins, Inter, Roboto Mono (Google Fonts via CSS import)
- **Icons**: lucide-react
- **Theming**: next-themes (light/dark toggle)
- **Data Crawling**: cheerio (HTML scraping from Wikipedia)
- **Deployment**: GitHub Actions → GitHub Pages (static `out/` directory)
- **Analytics**: Meta Pixel (ID: 337570375319394)
- **Node**: >=18.0.0

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout (Meta Pixel, ThemeProvider)
│   ├── page.tsx            # Home - full-screen scrollable hero sections
│   ├── globals.css         # Tailwind base + CSS variables + custom animations
│   ├── space/page.tsx      # Canvas-based animated space launch charts
│   ├── tech/               # Tech blog with MD content support
│   │   ├── page.tsx        # Server component listing posts
│   │   └── PostCard.tsx    # Client component with expand/collapse
│   ├── tools/
│   │   ├── page.tsx        # Tools hub + local business recommendations
│   │   └── calendar/2026/  # Printable calendar with holidays/stickers
│   ├── about/page.tsx
│   ├── business/page.tsx   # Legacy business page
│   ├── share/page.tsx      # Amazon affiliate product deals
│   ├── subscribe/page.tsx  # Email form (no backend)
│   └── thank-you/page.tsx
├── components/
│   ├── HeroSection.tsx     # Full-page scroll sections (SpaceX-style)
│   ├── Nav.tsx             # Header, Footer, NavLinks
│   ├── ThemeToggle.tsx     # Light/dark toggle button
│   ├── theme-provider.tsx  # next-themes wrapper
│   ├── RecordableChart.tsx # Canvas recording component (unused)
│   ├── index.ts            # Barrel exports
│   └── ui/                 # shadcn/ui primitives (button, card)
├── config/
│   ├── site.ts             # Site config, nav entries, hero sections
│   └── techPosts.ts        # Tech post definitions
├── hooks/
│   └── useCanvasRecorder.ts # Canvas recording hook (unused)
└── lib/
    ├── api.ts              # API service layer for launch data
    ├── posts.ts            # MD file reader for tech posts
    └── utils.ts            # cn() utility (clsx + tailwind-merge)

scripts/
├── crawl-cli.js            # Wikipedia launch data crawler (cheerio)
├── sync-data.js            # Copies data/*.json → public/api/
├── crawling_wiki_info.js   # Legacy crawler
└── bin/                    # Bootstrap/start scripts

data/
├── f9_launches_2025.json   # SpaceX Falcon 9 launch data
├── f9_launches_2026.json
├── world_launches_2025.json
├── world_launches_2026.json
└── posts/                  # Markdown content files
    ├── transformer-architecture.md
    └── 4086-cell-cn.md
```

## Key Commands

```bash
npm run dev              # Dev server on port 4000 (syncs data first)
npm run build            # Production build (syncs data + next build → out/)
npm run crawl            # Crawl all launch data (Falcon + World)
npm run crawl:falcon     # Crawl SpaceX Falcon 9 data only
npm run sync-data        # Copy data/*.json → public/api/
```

## Architecture Notes

- **Static export**: All pages are statically generated. No server-side API routes.
- **Mock API pattern**: JSON files in `data/` are synced to `public/api/` at build time. The client fetches from `/api/*.json` as if calling a real API.
- **Canvas charts**: Space page uses raw Canvas 2D API (no charting library) for animated visualizations with video recording capability.
- **Crawler**: `scripts/crawl-cli.js` scrapes Wikipedia launch tables using fetch + cheerio. Supports quarterly world launch data with automatic merging and date-based filtering.
- **Calendar**: Full-featured printable calendar with US federal holidays, BSD 405 school days, SVG stickers, and cute animal illustrations. Supports month/year view toggle and print optimization.
- **Hero sections**: Homepage uses CSS snap scrolling with side navigation dots, gradient backgrounds, and particle/star animations.

## Data Flow

1. `npm run crawl` → scrapes Wikipedia → saves to `data/*.json`
2. `npm run sync-data` (runs before dev/build) → copies to `public/api/`
3. Client-side fetch from `/api/*.json` → Canvas animations

## Conventions

- Path alias: `@/*` maps to `./src/*`
- Components use shadcn/ui patterns (CVA variants, Radix primitives)
- Dark mode via CSS class strategy (`next-themes`)
- Print styles via `@media print` with `print:` Tailwind prefix
- Custom domain configured via `static/CNAME`

## Pre-Commit E2E Verification (REQUIRED)

Before declaring changes ready to commit or push, ALWAYS run this verification:

1. **Build check**: Run `npm run build` — must pass with zero errors and all pages generated.
2. **Dev server smoke test**: Start `npm run dev`, then check every page returns HTTP 200:
   ```
   / /space/ /tech/ /tools/ /tools/calendar/2026/ /about/ /share/ /subscribe/ /thank-you/ /landing.html
   ```
3. **Content spot-check**: Verify key content renders on each page (titles, data, interactive elements).
4. **API data check**: Confirm `/api/f9_launches_*.json` and `/api/world_launches_*.json` serve valid JSON.
5. **Stop dev server** after verification.

Do NOT tell the user changes are ready to commit/push until all steps above pass.
