# AGENTS.md

Demo app: Houston apartment-locator portal. TanStack Start 1.x + React 19 + Tailwind CSS v4 + Motion (`motion/react`), built for Cloudflare Workers (nitro `cloudflare-module` preset).

## Verified commands

- `npm install` — install deps
- `npm run dev` — dev server at http://localhost:3000
- `npm run build` — production build to `.output/` (server: `.output/server/index.mjs`, static: `.output/public/`); prerenders 17 routes
- `npx wrangler dev` — preview the production build locally (do **not** deploy)

## Guardrails

- All listings, prices, events and stats are fictional — label everything "Sample".
- Only animation dependency: `motion` (import from `motion/react`).
- Design tokens live in `src/styles.css` (`@theme` + custom properties); spec in `design/KIMI_INSTRUCTIONS.md` is authoritative.
- Sample data is centralized in `src/lib/data.ts` — cards and detail pages must read from it.
- Listings filters/sort/page live in URL search params (`validateSearch` in `src/routes/listings.tsx`).
- Do not deploy; deployment happens from Git.
- Docs: see `docs/index.md` and `docs/decisions.md`.

## Legacy

- `public/legacy-demo.html` is the previous static demo (preserved, was `public/index.html`).
