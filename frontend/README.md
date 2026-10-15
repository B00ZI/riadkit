# RiadKit — Frontend

The Next.js application behind RiadKit: the owner dashboard, the reception desk, and the guest
portal that opens when a guest scans a room's QR code.

The marketing site is a separate, framework-free project in [`../landingpage`](../landingpage).

## Routes

| Path | Who it's for | What it is |
|---|---|---|
| `/login`, `/register` | Everyone | Sign in / create account |
| `/dashboard/*` | Owners | Rooms, front desk, portal content, history, staff, account |
| `/reception/*` | Reception staff | The streamlined front-desk view |
| `/room/[token]` | Guests | The guest portal — opened by QR code, no login |

Role rules are enforced in the layouts: `dashboard` is owner-only, `reception` accepts owner
and receptionist.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

Expects the API at `http://localhost:8000` by default — no configuration needed for local dev
(mind Windows: use `npm.cmd` in PowerShell).

## Environment variables

Only needed outside local dev (put them in `.env.local`):

| Variable | Default | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Laravel API base URL |
| `NEXT_PUBLIC_REVERB_APP_KEY` | — | WebSocket app key (Reverb) |
| `NEXT_PUBLIC_REVERB_HOST` | `localhost` | Reverb host |
| `NEXT_PUBLIC_REVERB_PORT` | `8080` | Reverb port |
| `NEXT_PUBLIC_REVERB_SCHEME` | `http` | `https` in production |

## How it talks to the backend

- **Staff auth** — login returns a Sanctum bearer token; it's kept in a cookie
  (`riadkit_staff_token`) and attached to every request by `lib/api.ts`. All API calls go
  through that one module — never call `fetch` on the API directly.
- **Guest sessions** — the guest portal stores a `session_id` cookie (`riadkit_session_id`)
  that travels with every portal request; the backend rejects it after check-out (the sticky
  session protection, explained in the backend README).
- **Live updates** — Laravel Echo over Reverb (`lib/echo.ts`): new guest requests appear on the
  reception and owner screens without a refresh. Without a Reverb server everything still
  works — updates just need a manual refresh.

## Conventions

- No global state library — server state lives in hooks, UI state stays local to components.
- Tailwind 4 + shadcn/ui primitives in `components/ui`; brand styling via Tailwind tokens.
- Route groups `(auth)`, `(dashboard)`, `(reception)` separate the three audiences.
- Toasts via `sonner`, drawers via `vaul`, charts via `recharts`.

## Build

```bash
npm run build       # production build (Vercel runs this automatically)
npm run lint
```
