# Decisions

- Only 6 of the 8 design events used, per the brief.
- `public/index.html` (legacy static demo) moved to `public/legacy-demo.html` — it shadowed the prerendered `/` output since TanStack Start serves `public/` as the static dir.
- Nitro prerender `concurrency: 1` — the scaffold default raced on concurrent writes of sibling routes under `.output/public/listings/`.
- Listings search params use `undefined`-default validation so bare `/listings` round-trips without a canonical-redirect loop (arrays/strings that don't serialize stably caused an SSR redirect loop and broke prerendering).
- `listings.tsx` is a layout route (`<Outlet/>`) + `validateSearch`; the browse UI lives in `listings.index.tsx` so `/listings/$id` doesn't inherit the browse page.
- Route `head:` option did not surface child meta in this TanStack Start version, so SEO tags are rendered via a `Seo` component (React 19 hoists document metadata) instead.
- Saved hearts persist in `localStorage` wrapped in try/catch, per spec.
- Detail pages are prerendered for all 12 sample ids (known at build time).
- No deployment performed, per instructions.
