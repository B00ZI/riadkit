# RiadKit — Landing Page

Marketing landing page for **RiadKit**, a digital guest-experience platform for Moroccan riads:
one QR code gives guests Wi-Fi details, house rules, services and a way to send requests; one
dashboard gives staff a place to handle them.

> Part of the **`riadkit` monorepo**: `backend/` (Laravel API), `frontend/` (Next.js app),
> `landingpage/` (this static site). This folder is fully self-contained — its own Tailwind v3
> build, untouched by the frontend's Tailwind 4 setup.

Vanilla static site — hand-written HTML, one Tailwind-generated stylesheet, one dependency-free JS
file. No framework, no bundler, no TypeScript, zero runtime third-party requests (fonts are
self-hosted).

> **Status:** not wired to any backend. The demo-request form is a front-end preview only —
> see [Known gaps](#known-gaps--todo). "Log in" links point at the real app
> (`https://riadkit.vercel.app/login`).

## Run it

```powershell
npm.cmd run serve     # local server at http://localhost:8080
npm.cmd run build     # rebuild css/styles.css after HTML/CSS changes
npm.cmd run watch     # rebuild on change
```

> **Windows/PowerShell:** use `npm.cmd`, not `npm` (PowerShell blocks `npm.ps1`).
> Opening `index.html` directly also works, but a server avoids `file://` quirks.

## Files

```
index.html              The landing page
css/styles.css          BUILT — never edit by hand
src/input.css           Source stylesheet (@tailwind + component classes)
src/fonts.css           @font-face for self-hosted Manrope
js/main.js              All interactions, no dependencies
assets/fonts/           Manrope woff2 (400–800)
assets/images/          Screenshots + riad photography
tailwind.config.js      Brand tokens (single source of truth for colour)
```

**Build rule:** `css/styles.css` is generated from `src/input.css` + the HTML. Tailwind only emits
classes it finds by scanning the files listed in `content` in `tailwind.config.js` — a class used
in a file that isn't listed there will silently never be emitted. Keep every shipped page listed.

**Deploy only:** `index.html`, `css/`, `js/`, `assets/` (deploy the whole folder — see the
repo's `DEPLOYMENT.md`). Never ship `node_modules/`, `src/`, `package.json`, `tailwind.config.js` — unused at runtime.

## Deployment

Deploys automatically via **GitHub Pages**: the `.github/workflows/deploy-landing.yml` workflow
runs on every push to `main` that touches `landingpage/**`, stages only the runtime files
(`index.html`, `css/`, `js/`, `assets/`) and publishes them.
Live at: `https://b00zi.github.io/riadkit/`

> Pages source must stay **Settings → Pages → Source: GitHub Actions** (not "Deploy from a
> branch" — a branch deploy would build the whole monorepo root and 404).

## Design system

Tokens live in `tailwind.config.js`. Key colours:

| Token | Hex | Role |
|---|---|---|
| `ivory` | `#FAF8F5` | Page background |
| `primary` | `#A63D40` | Terracotta — CTAs, accents |
| `sand` | `#E9D8C5` | Warm neutral, text on dark |
| `ink` / `muted` | `#2B2B2B` / `#666666` | Primary / secondary text |
| `night` | `#211B1A` | Dark sections |

Type: **Manrope**, self-hosted, weights 400–800. Content container: `.shell` (max 72rem).
Moroccan SVG motifs (`pattern-zellige`, `pattern-arches`) are inlined as data URIs in
`src/input.css`.

Prefer the component classes in `@layer components` (`.shell`, `.btn-*`, `.card`, `.eyebrow`,
`.phone`, `.reveal`, `.faq-item`, `.nav-link`) over re-assembling utilities inline.
`prefers-reduced-motion` disables all animation.

## Behaviour (`js/main.js`)

One IIFE, no dependencies: scrolled navbar + active link, mobile menu, reveal-on-scroll,
single-open FAQ accordion, ARIA demo tabs (arrow-key navigable), client-side form validation,
footer year. With JS off, everything stays visible (page is gated behind an `html.js` class).

**Sample content:** all riad names, guests, Wi-Fi credentials and requests are fictional
placeholders. The demo section is labelled as a front-end preview.

## Assets & licensing

> ⚠️ **Attribution removed at the owner's request.** The riad photography is from Wikimedia
> Commons under **CC BY-SA**, which requires crediting the authors (`credits.html` was deleted).
> If these photos stay on a public site, attribution must live somewhere — a one-line footer
> credit is the minimum. Swapping in CC0/Unsplash images removes the concern entirely.

App screenshots in `assets/images/` are RiadKit's own. Fonts: Manrope, SIL Open Font License.

## Known gaps / TODO

1. **Demo form has no backend** — wire to a Laravel endpoint, then restore real confirmation copy.
2. **`og:image` domain is a placeholder** (`https://riadkit.app/...`) — must be replaced with the
   real production URL before launch; scrapers need an absolute URL.
3. **Photo attribution** — see above; revisit before going public.

### Notes for working here

- The demo tabs are labelled **Welcome · Branding · Menu · Explore**; tab/panel IDs are paired in
  the DOM (`tab-*` ↔ `panel-*`) and read by JS — keep the pairing consistent if you rename.
- Floating cards in the demo section only render at `lg:` (≥1024px).
- Screenshot before/after verification: the built page has been checked by DOM measurement;
  do a visual pass at >1024px window width after layout changes.
