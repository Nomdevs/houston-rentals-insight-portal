# Docs — Houston Rentals Insight Portal (demo)

## Design source

- Authoritative spec: `design/KIMI_INSTRUCTIONS.md` (exported from Claude Design project `14b00590-463d-4e5d-9fd1-535d4ac1fc3d`).
- Additional design markup: `design/Houston Apartment Locator.dc.html`.
- Rules: `design/KIMI_STARTER_PROMPT.md`.

## Assets

- No image files. All imagery is local CSS gradient placeholders (`gradient()` in `src/lib/data.ts`), labeled "Photo placeholder · …".
- Fonts: Sora + Inter via Google Fonts (linked in `src/routes/__root.tsx`).

## Route map

| Route | File | Notes |
| --- | --- | --- |
| `/` | `src/routes/index.tsx` | Hero + search, count-up stats, featured carousel, how-it-works, neighborhoods, events, CTA |
| `/listings` | `src/routes/listings.tsx` (layout + `validateSearch`) + `src/routes/listings.index.tsx` | Filters/sort/pagination in URL search params, skeleton loading, active-filter chips |
| `/listings/$id` | `src/routes/listings.$id.tsx` | Gallery, amenities, price breakdown, sticky Request-a-Tour form, similar listings |
| `/get-started` | `src/routes/get-started.tsx` | 3-step wizard with validation, progress bar, sample success state |
| `/neighborhoods` | `src/routes/neighborhoods.tsx` | `?hood=` preselect, focus panel with stats/listings/events |
| `/events` | `src/routes/events.tsx` | 6 sample events, category chips, rent chart as inline SVG |

## Status

- `npm run build` passes; all 17 routes (6 pages + 12 listing details... 6 pages + 12 details listed) prerendered into `.output/public` with unique `<title>`/meta and full content.
- SEO: `Seo` component (`src/lib/seo.tsx`) rendered per route (React 19 hoists `<title>`/`<meta>` to `<head>`).

## Next steps

- Browser-level verification at 1440px/390px (layout, forms, console) — not yet done.
- Card-to-detail `layoutId` shared image transition (skipped for time).
