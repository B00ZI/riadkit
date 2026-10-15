# RiadKit — Backend (API)

The Laravel API that powers everything: staff authentication, riad management, the catalog,
guest requests, and live updates over WebSockets. Every response is scoped to a single riad —
the platform is multi-tenant by design.

- **Stack:** Laravel 13 · PHP 8.3 · Sanctum · Reverb · Cloudinary · SQLite (dev) / MySQL (prod)
- **Base URL (local):** `http://localhost:8000/api`

## Setup

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed     # demo riad + owner account
php artisan serve              # http://localhost:8000
```

Optional processes — live updates need Reverb, queued jobs need the worker:

```bash
php artisan reverb:start --port=8080
php artisan queue:listen
```

Seeding creates a demo account you can sign in with everywhere:

> **owner@riadkit.test / password** — *Riad Jardin de Marrakech*

### Environment variables you'll actually touch

| Key | Local default | Notes |
|---|---|---|
| `DB_CONNECTION` | `sqlite` | MySQL in production |
| `FRONTEND_URL` | `http://localhost:3000` | CORS origin — must match the deployed frontend |
| `SANCTUM_STATEFUL_DOMAINS` | `localhost:3000` | add the deployed frontend domain |
| `REVERB_APP_KEY` / `HOST` / `PORT` | `localhost:8080` | must match the frontend's `NEXT_PUBLIC_REVERB_*` |
| `CLOUDINARY_URL` | — | image uploads (portal branding, menus, …) |

---

## API reference

Two completely separate worlds:

1. **Staff & owner API** — bearer-token auth (Laravel Sanctum).
2. **Public guest API** — QR token + *sticky session*, no accounts.

### Authentication (staff & owners)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/register` | Creates a riad + owner account, returns a bearer token |
| `POST` | `/login` | Returns a bearer token |
| `GET` | `/user` | The authenticated user |
| `POST` | `/logout` | Revokes the token |

Send the token with every protected request:

```
Authorization: Bearer {token}
```

> The web app keeps this token in a cookie (`riadkit_staff_token`) and attaches the header
> automatically via `frontend/lib/api.ts`. Public self-registration is temporary — manual
> onboarding (admin-created accounts) is planned.

### Dashboard & account *(protected)*

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/dashboard` | Owner overview payload |
| `GET` | `/account` | Profile |
| `PUT` | `/account/profile` | Update name / email |
| `PUT` | `/account/password` | Change password |
| `DELETE` | `/account` | Delete account |
| `GET` / `PUT` | `/settings` | Riad settings |

### Rooms & front desk *(protected)*

| Method | Endpoint | Description |
|---|---|---|
| `GET` / `POST` | `/rooms` | List / add rooms (each gets a 16-char `qr_token`) |
| `PUT` / `DELETE` | `/rooms/{room}` | Edit / remove a room |
| `GET` | `/rooms/print-batch` | Bulk QR print data |
| `GET` | `/rooms/{room}/print-data` | QR print data for one room |
| `POST` | `/rooms/{room}/checkin` | Guest checked in — starts a new session |
| `POST` | `/rooms/{room}/checkout` | Guest checked out — expires the session |
| `GET` | `/requests` | Pending + in-progress guest requests (live desk) |
| `PATCH` | `/requests/{id}` | Update a request's status |

### Catalog *(protected, full CRUD)*

| Resource | Endpoints |
|---|---|
| `GET`/`POST` | `/categories` — groups for menus and services |
| `GET`/`POST`/`PUT`/`DELETE` | `/menu-items` — food & drink with pricing |
| `GET`/`POST`/`PUT`/`DELETE` | `/services` — in-house requests (towels, cleaning…) |
| `GET`/`POST`/`PUT`/`DELETE` | `/excursions` — local tours with duration & price |
| `GET`/`POST`/`PUT`/`DELETE` | `/house-rules` |

### Staff, uploads & notifications *(protected)*

| Method | Endpoint | Description |
|---|---|---|
| `GET`/`POST`/`PUT`/`DELETE` | `/staff` | Reception accounts for the riad |
| `POST` / `DELETE` | `/upload`, `/uploads` | Cloudinary image upload / removal |
| `GET` | `/notifications`, `/notifications/unread-count` | Owner notifications |
| `PATCH` | `/notifications/read-all`, `/notifications/{id}/read` | Mark read |

### Guest portal *(public — QR token + sticky session)*

Guests never log in. The QR code in the room carries the room's `qr_token`; the browser carries
a `session_id` cookie created at check-in.

**Bootstrap the portal** — one request returns everything the guest can see:

```
GET /guest/portal/{qr_token}?session_id={cookie_session_id}
```

Returns riad info, menus, services, excursions, house rules and a `session_status` flag:

- session matches the room's active check-in → `"active"` (ordering enabled)
- missing or stale session → `"expired"` (browsing still works, ordering disabled)

**Submit a request:**

```
POST /guest/requests
```

```json
{
  "qr_token": "A1B2C3D4E5F6G7H8",
  "session_id": "random16charSession",
  "type": "menu",
  "item_id": 12,
  "quantity": 2,
  "notes": "No sugar in the mint tea, please."
}
```

`type` is one of `menu`, `service` or `excursion`.

**Why "sticky":** when a guest checks out, the room's session ID changes. Any request arriving
with the old `session_id` is rejected with `403` — so a previous guest can never order into the
new guest's room, even if they kept the QR photo.

## Conventions

- All routes live in `routes/api.php`; protected staff routes sit inside `auth:sanctum`.
- Controllers return JSON directly — no Form Requests, no API Resources.
- Multi-tenancy is enforced by scoping every query to the authenticated user's `riad_id`.
- Code style: Laravel Pint (`vendor/bin/pint`).
