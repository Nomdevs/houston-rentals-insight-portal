# houston-rentals-insight-portal

TanStack Start demo of the Houston Rentals Insight Portal (proposal: `Houston-Rentals-Portal-Overview.pdf`).
All figures are fictional sample data, labeled "Sample" in the UI.

## Stack

TanStack Start 1.x (React 19, file-based routes) · Tailwind CSS v4 · Motion (`motion/react`) · TypeScript · npm · Cloudflare Workers target (nitro `cloudflare-module` preset).

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

## Build

```bash
npm run build      # outputs .output/ (server: .output/server/index.mjs, static: .output/public)
npx wrangler dev   # preview the production build locally
```

The build prerenders all six routes plus the 12 sample listing-detail pages; verify with:

```bash
grep -o "<title>[^<]*" .output/public/listings/l1/index.html
```

## Structure

- `src/routes/` — the six screens (`/`, `/listings`, `/listings/$id`, `/get-started`, `/neighborhoods`, `/events`)
- `src/lib/data.ts` — exact sample data from the design spec (12 listings, 8 neighborhoods, 6 events, rent chart)
- `src/styles.css` — design tokens (Sora/Inter, teal/coral palette) as Tailwind v4 `@theme`
- `design/` — authoritative design spec and export
- `docs/` — `index.md` (route map, status) and `decisions.md`
- `public/legacy-demo.html` — previous self-contained static demo, preserved
- `wrangler.jsonc` — Cloudflare Workers config (`main: .output/server/index.mjs`, assets `.output/public`)

## Deploy to Cloudflare Workers

Deployment happens from Git; do not deploy manually. If ever needed:

```bash
npx wrangler login
npx wrangler deploy
```
