<p align="center">
  <img src="frontend/public/riadkitlogo.png" alt="RiadKit" width="96" />
</p>

<h1 align="center">RiadKit</h1>

<p align="center">
  A digital guest experience for Moroccan riads.<br/>
  One QR code for the guests. One dashboard for the team.
</p>

---

A riad owner signs up, adds their rooms, prints a QR code for each one, and their guests are
connected from the moment they scan it: Wi-Fi details, house rules, menus, services, local
recommendations — plus a simple way to ask for extra towels or a hammam session. Requests land
on the team's dashboard the moment they're sent.

## What's in this repository

Three independent apps live side by side:

| Folder | What it is | Built with | Live at |
|---|---|---|---|
| [`backend/`](backend/) | The API — auth, rooms, catalog, guest requests, live updates | Laravel 13 (PHP 8.3) | — |
| [`frontend/`](frontend/) | The product — owner dashboard, reception desk, guest portal | Next.js 16 + React 19 | [riadkit.vercel.app](https://riadkit.vercel.app) |
| [`landingpage/`](landingpage/) | The marketing site | Plain HTML + Tailwind, no framework | [b00zi.github.io/riadkit](https://b00zi.github.io/riadkit/) |

Each folder is self-contained — its own dependencies, its own deploy. Nothing in one breaks
another.

## How the pieces fit together

```
   guest scans QR ──▶  frontend /room/[token]  ──▶  backend: public guest API
   ────────────────────────────────────────────────────────────────────────
   request sent!     ◀──  owner / reception dashboards ◀──  live via WebSockets
```

- **Guests never create an account.** The QR code *is* the key: every room has a token, every
  stay gets a session, and when a guest checks out their links stop working.
- **Staff log in normally.** Owners see the whole property — rooms, catalog, prices, staff
  accounts, history. Reception accounts get the streamlined front-desk view.
- **Every riad only sees its own data.** The API is multi-tenant; scope is enforced per request.

## Run it locally

### 1 — The API (backend/)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed      # builds the demo riad with rooms, menus, services
php artisan serve               # http://localhost:8000
```

Optional, for live updates and background jobs:

```bash
php artisan reverb:start --port=8080
php artisan queue:listen
```

### 2 — The app (frontend/)

```bash
cd frontend
npm install
npm run dev                     # http://localhost:3000
```

It talks to the API at `localhost:8000` out of the box — nothing to configure for local dev.

### 3 — The marketing site (landingpage/)

```bash
cd landingpage
npm install
npm run serve                    # http://localhost:8080
npm run build                    # rebuild css/styles.css after edits
```

### Sign in with the demo account

After seeding the backend:

> **owner@riadkit.test / password**

It opens *Riad Jardin de Marrakech* — rooms, menus, services and excursions already filled in.

## The tech, in one glance

- **Backend** — Laravel 13 · Sanctum auth · Reverb WebSockets · Cloudinary for images ·
  SQLite locally, MySQL in production
- **Frontend** — Next.js 16 (App Router) · TypeScript · Tailwind 4 · shadcn/ui ·
  Laravel Echo for live updates
- **Landing page** — hand-written HTML, one generated stylesheet, zero JS dependencies.
  Deliberately boring: fast, tiny, and immune to framework churn

## Deploying

- **Landing page** → GitHub Pages, automatically on every push to `main`
  (`.github/workflows/deploy-landing.yml`)
- **Frontend** → Vercel ([riadkit.vercel.app](https://riadkit.vercel.app))
- **Backend** → any PHP host — see [`DEPLOYMENT.md`](DEPLOYMENT.md) for env vars,
  CORS/Sanctum domains, Reverb and the pre-launch checklist

## Documentation

| Doc | What's in it |
|---|---|
| [`DEPLOYMENT.md`](DEPLOYMENT.md) | Production deployment, domains, pre-launch checklist |
| [`AI_CONTEXT.md`](AI_CONTEXT.md) | Architecture deep-dive: folder structure, conventions, auth flows |
| [`backend/README.md`](backend/README.md) | Setup + full API reference, guest flow explained |
| [`frontend/README.md`](frontend/README.md) | App structure, routes, environment variables |
| [`landingpage/README.md`](landingpage/README.md) | Design system and build notes for the marketing site |
