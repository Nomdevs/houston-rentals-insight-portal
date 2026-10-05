Read `design/KIMI_INSTRUCTIONS.md` fully, then `design/Houston Apartment Locator.dc.html` (tokens, markup, and the `<script type="text/x-dc">` block with the sample data and logic). Also read any existing `AGENTS.md`, `README.md` and `wrangler.jsonc` in the repo root, and preserve them.

Build the Houston apartment-locator demo it describes: TanStack Start + TypeScript + Tailwind + npm, targeting Cloudflare Workers, with Motion as the only animation dependency. **Hard limit: 20 minutes.** Do not deploy.

Rules:
1. Check official docs before choosing scaffold commands and the Motion package/import path. Do not guess flags.
2. Scaffold first and confirm `npm run build` passes, then build in this order: Home, Listings, Listing Detail, Get Started, Neighborhoods, Events & Data. Finish all six screens before polishing.
3. Use the exact sample data in the instructions (12 listings, 8 neighborhoods, 6 events, 1 rent chart). Label fictional data "Sample". Use local placeholders only.
4. Keep Listings filters, sort and page in URL search params.
5. Write `AGENTS.md`, `docs/index.md` and `docs/decisions.md` early and update them at the end.
6. Commit after each screen, staging only your own files.
7. At minute 16, stop adding features. Run the build, check Search → Listings → Detail → tour inquiry and Get Started → success at 1440px and 390px, and mark anything you can't verify as "not verified".

Finish with a short report: routes done, build results, remaining issues and the local run command.
