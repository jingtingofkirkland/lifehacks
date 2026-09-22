# Copilot instructions for lifehacks.zeey-app.net

This is a Next.js 14 personal site (static export, deployed to GitHub Pages
from the `master` branch). Keep reviews and suggestions aligned with how this
repo actually works.

## Stack & deployment
- Next.js 14 (App Router), React 18, TypeScript (strict), Tailwind CSS.
- `output: 'export'` — everything must build to static HTML. No server
  components that need a server, no API routes, no `next/image` optimization.
- Deployed via `.github/workflows/nextjs-deploy.yml` on push to `master`.
- CI (`.github/workflows/ci.yml`) runs `tsc --noEmit`, `vitest run`, and a
  full `next build`. All three must pass.

## Conventions
- Default branch is `master` (not `main`).
- Client components that touch `window`/`document`/`localStorage` must run
  that code inside `useEffect`, never during render.
- Tool pages live under `src/app/tools/<name>/page.tsx` and are linked from
  `src/app/tools/page.tsx`. Keep the site chrome (header/nav) untouched;
  scope tool-specific CSS so it cannot leak (see the math tool's `.math-tool`
  scoping in `src/app/tools/math-addition/tool-content.ts`).
- The kids-math tool content is generated from the standalone artifact by
  `build-tool-content.py`; never hand-edit `tool-content.ts`, regenerate it.
- Tests live next to the code as `*.test.ts` and run with `npm test`.
  Behavioral tests for interactive tools should exercise the real shipped
  code (see `src/app/tools/math-addition/tool.test.ts`), not a re-implementation.

## What to flag in review
- Anything that breaks the static export (server-only APIs, dynamic routes
  without `generateStaticParams`).
- `window`/`document`/`localStorage` accessed outside `useEffect` or event handlers.
- Unscoped global CSS that could leak into the site chrome.
- New dependencies without a lockfile update (`npm ci` must keep working).
- Missing or weakened tests for tool behavior changes.
