# Kimi Code task: build the [Brand] Houston apartment-locator demo

Build a working **[Brand] Houston apartment-locator demo**. Work autonomously, keep output concise, and finish all six screens within **20 minutes**.

## Design source (local, authoritative)
The design was exported from Claude Design (project `14b00590-463d-4e5d-9fd1-535d4ac1fc3d`). Kimi cannot reach that service, so use the local files:

- `design/Houston Apartment Locator.dc.html` — the full design: markup, tokens, data and interaction logic. Read it first. The `<script type="text/x-dc">` block holds the sample data and the behavior to port.
- Notes below describe `ListingCard.dc.html` (not exported). Rebuild it from these notes.
- Ignore the `system` and `mobile` pages in the design (style-guide screens). Build only the six screens below.
- The `_ds/industry-*` design system in the project is unrelated (steel-blue wireframe). **Do not use it.** The real palette and type are below.

If `design/` is missing or unreadable, stop and report. Never invent screens. Do not copy text, listings, photos or logos from any reference website.

## Tokens (from the design)
- Fonts: **Sora** 600/700 (headings, prices, letter-spacing -.02em) and **Inter** 400/500/600 (body). Load via Google Fonts, or self-host if the build must work offline.
- Colors: background `#F7F8F5`; surface `#FFFFFF`; ink `#10202B`; muted text `#4A5A66`; Bayou teal (primary) `#0E7C7B`, dark teal hover `#075554`; teal tint `#E4F2F1`; Sunset coral (accent) `#FF7A59` (chart 2BR `#E0583A`); error `#B3261E`; input border `#cfd8d8`; row divider `#e8eeec`; chart grid `#e1e6e3`.
- Focus: `3px solid #0E7C7B`, offset 2px. Minimum touch target 44px.
- Cards: radius 20px, shadow `0 1px 2px rgba(16,32,43,.06), 0 8px 24px rgba(16,32,43,.07)`. Hover: lift 6px with a deeper shadow `0 2px 4px rgba(16,32,43,.08), 0 20px 44px rgba(16,32,43,.14)`, image scale 1.05. Tap: scale .97.
- Pills and chips: radius 999px. Selected is teal fill with white text; unselected is white with a `#cfd8d8` border.
- Layout: max-width 1200px, 24px gutters. Fixed header 72px; transparent with white text over the home hero, then white 88% with blur and shadow after 40px of scroll.
- Easing: `cubic-bezier(.22,1,.36,1)` (default), `cubic-bezier(.34,1.56,.64,1)` (heart pop).

## Stack and setup
- TanStack Start, TypeScript, Tailwind CSS, **npm**, targeting **Cloudflare Workers**. Check current official docs and use the supported scaffold/integration commands. Do not guess flags.
- Read any existing `AGENTS.md` and inspect the repo first. The repo already has `README.md`, `wrangler.jsonc`, `public/index.html` and `Houston-Rentals-Portal-Overview.pdf`. Preserve them. Inspect `wrangler.jsonc` before overwriting anything.
- Scaffold first and confirm the starter builds before implementing the design.
- Prerender eligible public routes with TanStack Start's supported config. Search and forms must stay interactive.
- `npm run build` must pass. The Worker `name` in `wrangler.jsonc` must be a valid deployment name matching the project.
- **Do not deploy.** Deployment happens from Git.

## Time-box
- 0–3 min: scaffold, Cloudflare config, first build.
- 3–5 min: tokens, shared components, local data.
- 5–16 min: Home, Listings, Detail, Get Started, Neighborhoods, Events & Data.
- 16–20 min: responsive fixes, verification, docs.

Commit after each stage (stage only your own files). Implement every screen before polishing. At the deadline, report what's unfinished.

## Routes
`/` Home · `/listings` · `/listings/$id` · `/get-started` · `/neighborhoods` · `/events`

Header nav (aria "Main"): Home, Listings, Neighborhoods, "Events & Rent Data", plus a "Get Started" button. Brand button on the left links home.

### 1. Home
- Hero: full-bleed local placeholder labeled "Photo placeholder · Houston skyline at dusk". H1 **"Your next Houston home, found for you."** Paragraph: "Tell us what matters. We search, shortlist and schedule tours for you. Our apartment-finding help is free, and recommendations are tailored to your budget, commute and lifestyle." Buttons: Get Started (primary) and Browse Apartments.
- Search bar overlapping the hero bottom: Neighborhood select (Any + 8), Monthly budget max (number, e.g. 2000), Bedrooms select (Any, Studio, 1, 2, 3+), Search submit. It navigates to `/listings` with `hoods`, `max`, `beds` search params. Persistent labels.
- Stats row (count-up once, 1.4s ease-out cubic): 1,240+ listings, 8 neighborhoods, 36 events this season, $1,742 median rent/mo. Each is labeled "**Sample** · …".
- "Featured · Sample listings" with H2 "Apartments to start with". Three cards from the first 6 listings, with prev/next buttons ("Previous apartments"/"Next apartments"), wrap-around, **never auto-advance**.
- "How it works" ("Four steps, no cost to you."): 01 Share preferences — Tell us your budget, timing and must-haves. 02 Receive matches — We shortlist apartments that fit. 03 Tour favorites — We help schedule visits. 04 Choose a home — Pick the one that feels right.
- "Explore neighborhoods": 8 photo-placeholder tiles with name and "N sample listings", plus an "All neighborhoods →" link.
- "Happening in Houston · Sample events": first 3 events, with an "All events →" link.
- Closing CTA: "Ready to find your place?" / "Share a few preferences. It takes about two minutes and costs nothing." Buttons: Get Started, Browse Apartments.

### 2. Listings
- H1 "Browse apartments"; live region: "**N sample results** · Filters: …" or "No filters applied".
- Filters: neighborhood toggle chips (aria-pressed), min/max $/mo (defaults 1000/3500), bedrooms (Any, Studio, 1, 2, 3+), bathrooms (Any, 1, 2+), "Specials only" switch (`role=switch`), sort (Price Low–High, Price High–Low, Newest, Largest).
- Active filter chips (each "✕", aria-label "Remove filter X") plus "Clear All".
- Every filter change shows a ~600ms skeleton (3 shimmer cards, `aria-busy`), then results. Empty state: "No sample apartments match" / "Try a wider budget or fewer neighborhoods." / Reset Filters.
- 6 per page, pagination (Previous, numbered with aria-current, Next; disabled at the ends); a filter change resets to page 1.
- **Keep filters, sort and page in URL search params** (validated with the router's search validation).
- Filter logic: bed 3+ means ≥3, Studio means 0; bath 2+ means ≥2; specials means concession > 0. Sort "newest" is new-first, then higher id.

### Listing card (shared component)
- 200px image area with a gradient placeholder, labeled "Photo placeholder · Living room/Balcony/Kitchen". 3-slide carousel with prev/next (44px targets, aria "Previous photo"/"Next photo") and dots. Click opens detail.
- Badges top-left: coral "New" (if new) and white "Sample". Heart top-right (44px target, aria-pressed, label "Save {name}"/"Remove {name}", fills coral, pops to scale 1.3 with a spring). The heart must not trigger card navigation.
- Body: `$rent` + "/mo base" (Sora 22px). If there is a concession, show a teal-tint pill "Eff. $X/mo". Then name, "{beds} bd · {baths} ba · {sqft} sqft", neighborhood.
- Placeholder gradient: `linear-gradient(135deg, hsl(H 45% 80%), hsl(H+20 40% 93%))` with `H = 170 + (n*23 % 60)`, where n is the listing number.
- Saved state persists across pages in memory or localStorage (wrapped in try/catch).

### 3. Listing Detail (`/listings/$id`)
- Breadcrumb Home / Listings / {name}. H1 "{name}" plus a "Sample" tag. "{hood}, Houston · {beds} bd · {baths} ba · {sqft} sqft". Save button (aria-pressed).
- Gallery: large placeholder plus 3 thumbnails (Living room, Balcony, Kitchen) with a selected border.
- "About this home": "A bright {beds}-bedroom layout with tall windows and an open living area, set in {hood}. Sample available date: **Apr 12 (sample)**. This is fictional sample content and not an offer of a real unit."
- Amenities in 3 groups. In the home: Washer/dryer, Walk-in closet, Balcony, Quartz counters. Community: Pool, Fitness center, Package lockers, Dog park. Getting around: Near rail stop, Covered parking, Bike storage.
- "Price breakdown · Sample" rows:
  1. Base monthly rent = rent (Sample, recurring)
  2. Concession = "− $conc" or None ("Sample one-time credit, N month(s) of rent")
  3. Recurring monthly fees = `fee` (Sample trash, pest and amenity fees)
  4. **Estimated effective rent** = `eff`/mo (bold). Note: "Estimate: base rent minus concession ÷ 12 months. Not a payment amount."
  5. Application fee $50 (one-time)
  6. Deposit $300 (one-time)
- Explainer: "What is effective rent? It is an estimate: the sample concession is spread across a 12-month sample lease. It is not your monthly payment. Monthly payments are base rent plus recurring fees; the application fee and deposit are one-time costs."
- Sticky aside "Request a Tour" form: Full name*, Email*, Phone*, Preferred tour date*, Message (optional). Validate on submit. Errors: "Enter your name." / "Enter a valid email, like name@example.com." / "Enter a 10-digit phone number." / "Choose a preferred date." Disclaimer: "…This prototype does not send data anywhere." Success state "Sample confirmation": "This was a sample submission. No tour was requested and nothing was sent. {name}, a real version would contact you at {email}." plus "Start over".
- "Similar apartments · Sample": 3 cards, same neighborhood first.

### 4. Get Started
- H1 "Get Started" / "Three short steps. Free to use. No credit or background questions."
- A progress bar showing "Step N of 3 · {title} {pct}%" (33/67/100) with an animated fill.
- Step 1 "Move date & budget": date (required), monthly budget number (required, ≥ 500; error "Enter a monthly budget of at least $500."). Step 2 "Home size": Bedrooms (Studio, 1, 2, 3+) and Bathrooms (1, 1.5, 2, 3+) pill groups, both required. Step 3 "Your details": name (required), email (valid), phone (required, 10 digits, only if contact is Phone/Text), contact method (Email/Phone/Text), marketing checkbox (unchecked).
- Back button disabled on step 1; the final button reads "Submit (sample)". **Answers are preserved** when going back and forth. Each step slides in horizontally (32px, `stepIn`).
- Success: a drawn checkmark, "Thanks, {name}", "**Sample submission.** Nothing was sent to a real service and no one will contact you.", a summary (Move date, Budget `$X/mo`, Bedrooms, Bathrooms, Contact `name · method`), and the buttons Browse Apartments and Start over.

### 5. Neighborhoods
- H1 "Neighborhoods" / "Eight areas to compare. Counts and figures are **Sample** data."
- 8 selectable cards (aria-pressed): placeholder, name, "N sample listings", 3 tag chips.
- Expanded "Neighborhood focus" panel for the selected one: H2 name, story, three stats (Median rent · Sample, Walkability score · Sample "/100", Sample listings count), then "Sample listings in {name}" (3 cards, with fallback to other listings if it has fewer than 3) and "Upcoming sample events" (3).
- `/neighborhoods?hood=Midtown` should preselect. Home tiles link there.

### 6. Events & Data
- H1 "Houston events & rent data" / "All events and figures on this page are **Sample** content."
- Category chips (group, aria-pressed): All, Music, Food, Outdoors, Arts. Empty state "No sample events in this category" / "Show all events".
- **Exactly 6 events** (the design has 8; use the first 6 below).
- "Rent snapshot · Sample data": range toggle (6 months/12 months), 3 stat tiles (Median 1BR rent · Sample, Change N mo · Sample as ±%, Avg. concession · Sample "0.6 months"). Build the **single rent chart** as inline SVG, 800x300 viewBox: lines for Studio (ink), 1BR (teal), 2BR (coral), grid at $1,000/1,400/1,800/2,200, y-scale `240 - (v-1000)/1400*220`, x from 64 to 740, month labels (every 2nd on 12-month view), axis titles "Month (sample)" and "Monthly rent (USD)", a legend labeled "(sample)", and lines that draw in via stroke-dashoffset. Beneath it: a text summary "In this sample, the median 1BR rent moved from $X to $Y over N months, a Z% change. Studios and 2BR units follow a similar gradual rise." and "Sample data for design purposes only. It is not live and does not describe real Houston rents."

## Sample data (use exactly)
Listings `[id, name, hood, rent, concessionMonths, beds, baths, sqft, isNew]`:
```
l1  The Larkspur      Midtown        1895  1   1 1 720  new
l2  Bayou Row Lofts   Heights        2150  .5  2 2 1010
l3  Quill & Main      Downtown       1640  0   0 1 505  new
l4  Marigold Court    Montrose       1780  1   1 1 690
l5  Harbor Light      EaDo           1520  .5  1 1 640
l6  Cedar Terrace     Medical Center 1395  0   1 1 610
l7  Alder & Pine      Uptown         2480  1   2 2 1180 new
l8  Oakmere           Rice Village   2690  0   3 2 1420
l9  The Wren          Midtown        1465  0   0 1 480
l10 Juniper House     Heights        2890  .5  3 2 1500 new
l11 Sable Park        Montrose       1560  1   1 1 665
l12 Tidewater         Midtown        2275  0   2 2 980
```
Derived: `concession = months * rent`; `effective = rent - concession/12`; `fee = 55 + (beds % 3) * 10`; beds 0 displays "Studio". Format money as `$1,895` (rounded). Cards and detail must read from the same data.

Neighborhoods `[name, tags, medianRent, walkScore, story]`:
- Midtown, [Transit, Dining, Nightlife], 1760, 82, "Midtown is a compact area south of Downtown with light rail access, restaurants and short commutes to Downtown and the Medical Center. Parking and noise vary by block."
- Heights, [Parks, Bike trails, Local shops], 2020, 68, "The Heights offers tree-lined streets, a hike-and-bike trail, independent shops and cafes. Most daily trips are by car, with some walkable pockets."
- Montrose, [Dining, Museums, Walkable], 1710, 76, "Montrose is centrally located with museums, restaurants and a mix of older and newer buildings. Several bus routes serve the area."
- Downtown, [Transit, Parks, Commute], 1580, 88, "Downtown has the most direct rail and bus connections, plus bayou-side parks and sports venues. Grocery options are growing but fewer than in other areas."
- EaDo, [Breweries, Stadiums, Murals], 1490, 71, "EaDo sits east of Downtown near stadiums and light rail. Dining and entertainment are clustered around a few main streets."
- Medical Center, [Commute, Transit, Parks], 1420, 60, "The Medical Center is a major employment hub with rail service and nearby Hermann Park. Many residents commute on foot or by shuttle."
- Uptown, [Shopping, Dining, Offices], 2410, 74, "Uptown is centered on offices, shopping and dining near the Galleria. Traffic is heavy at peak hours; bus rapid transit serves the main corridor."
- Rice Village, [Dining, Campus, Parks], 2480, 79, "Rice Village surrounds a walkable shopping and dining district next to a university campus, with access to Hermann Park and the Medical Center."

Events (6) `[mon, day, title, location, category, description]`:
1. Mar 14 · Bayou Lights Night Market · Buffalo Bayou Park · Food · Local food vendors and live acoustic sets along the water.
2. Mar 21 · Skyline Run 5K · Downtown · Outdoors · A morning fun run with a flat route through Downtown.
3. Mar 28 · Gallery Walk · Montrose · Arts · Open studios and pop-up exhibits across the neighborhood.
4. Apr 04 · Porch Sessions · The Heights · Music · Small-stage music on neighborhood porches and patios.
5. Apr 11 · Hermann Park Picnic Day · Medical Center · Outdoors · Lawn games, picnic spots and a plant swap.
6. Apr 18 · Taco Trail Tasting · EaDo · Food · A self-guided tasting route across local taquerias.

Rent chart (months Apr…Mar, 12 values):
- Studio: 1250,1260,1265,1275,1280,1290,1295,1305,1310,1320,1330,1340
- 1BR: 1580,1590,1600,1615,1625,1640,1650,1660,1670,1678,1684,1690
- 2BR: 2090,2100,2120,2135,2150,2165,2180,2190,2205,2215,2225,2230

Label every fictional price, special, availability, event and statistic **"Sample"**. Never present effective rent as a monthly payment. Images are **local only** (generated gradient placeholders or files in `/public`); no external imagery, chatbot, testimonials, ratings, licenses or credentials. No backend, auth, database or real inquiries.

## Motion and accessibility
- One animation dependency: **Motion**. Verify the current package name and React import path with `npm view` and the official docs before installing.
- Hero: fade/rise 24px with 0.08s stagger; restrained image parallax and zoom. Sections and counters reveal once. Card hover lift/tap scale. Heart spring (stiffness 260, damping 24). Filter chips and results via AnimatePresence plus light layout animation. Card to detail shared-image `layoutId` only if it doesn't slow completion. Page transition: fade plus 16px slide. Form steps: horizontal slide, smooth progress fill, drawn checkmark. Skeleton shimmer. Carousels never auto-advance.
- Respect `prefers-reduced-motion`: remove parallax, translations, zoom and shimmer (fade only or instant).
- Semantic HTML, one H1 per page, logical headings, persistent labels, visible focus, accessible contrast, touch-friendly controls.

## SEO
One reusable metadata helper. Unique title and description per route (listing detail uses the listing name and hood). Prerender eligible public routes and confirm the built HTML contains the content and metadata. Do not claim it is verified unless you checked.

## Documentation (only these 3 files)
- `AGENTS.md`: verified commands, concise guardrails, links to the other two. Preserve existing content.
- `docs/index.md`: design source (`design/` folder, Claude Design project id above), asset location, route map, status, next steps.
- `docs/decisions.md`: one line per consequential decision with rationale. Example: only 6 of the 8 design events used, per the brief.
Store no secrets. Create early, update before finishing.

## Verification and report
Run the production build and available checks. Verify: Search → Listings → Detail → sample tour inquiry; Get Started → success; Home and Listings at **1440px and 390px**; local assets, navigation, overflow, console errors. Mark anything you can't check as **not verified**.

Finish with a short report: completed routes, build/check results, remaining issues and the local run command. **Do not deploy.**
