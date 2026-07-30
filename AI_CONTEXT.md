# RiadKit — AI Context

## Project Overview

RiadKit is a multi-tenant SaaS platform for Moroccan riads (guesthouses). It provides a digital guest portal accessed via QR codes, a reception (front desk) dashboard for managing check-in/checkout and orders, and an owner dashboard for analytics, catalog management (menu, services, excursions, house rules), staff management, settings, and QR code generation.

**Main goal:** Digitize the guest experience — guests scan a QR code in their room to access a mobile portal where they can view the riad info, order food, request services, book excursions, and view house rules.

**Target users:**
- **Riad owners** — manage rooms, catalog, staff, view analytics
- **Receptionists** — check in/out guests, manage orders in real-time
- **Guests** — use the mobile portal via QR code

**Architecture:** Monorepo with separate Laravel backend (API) and Next.js frontend (SPA).

---

## Tech Stack

### Backend
- **PHP 8.3+** / **Laravel 13.x**
- **MySQL** — primary database
- **Laravel Sanctum** — token-based API authentication
- **Laravel Reverb** — WebSocket broadcasting
- **Cloudinary** — image upload/storage (CDN)
- **Spatie Browsershot** — PDF generation for QR code printouts
- **Knuckles Scribe** — API documentation generation

### Frontend
- **Next.js 16** (with app router)
- **TypeScript**
- **React 19**
- **Tailwind CSS 4** — styling
- **shadcn/ui** — component library (radix-nova style)
- **Lucide React** — icons
- **Recharts** — revenue charts
- **Sonner** — toast notifications
- **Laravel Echo + Pusher.js** — WebSocket client
- **js-cookie** — cookie management
- **Vaul** — drawers (mobile-friendly)
- **qrcode** — QR code generation (client-side)
- **html2canvas** + **jszip** — for export features

---

## Folder Structure

```
riadkit/
├── backend/                          # Laravel API
│   ├── app/
│   │   ├── Events/                   # Broadcast events (ShouldBroadcastNow)
│   │   │   ├── NewNotification.php
│   │   │   ├── RequestCreated.php
│   │   │   ├── RequestUpdated.php
│   │   │   └── RoomStatusUpdated.php
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── AuthController.php          # register, login
│   │   │   │   ├── GuestPortalController.php   # public guest portal
│   │   │   │   ├── ReceptionController.php     # checkin/checkout
│   │   │   │   ├── RiadController.php          # settings
│   │   │   │   ├── RoomController.php          # room CRUD + QR print
│   │   │   │   └── Api/
│   │   │   │       ├── CategoryController.php
│   │   │   │       ├── ExcursionController.php
│   │   │   │       ├── GuestRequestController.php
│   │   │   │       ├── HouseRuleController.php
│   │   │   │       ├── MenuItemController.php
│   │   │   │       ├── NotificationController.php
│   │   │   │       ├── ServiceController.php
│   │   │   │       ├── StaffController.php
│   │   │   │       └── UploadController.php
│   │   │   └── Middleware/
│   │   │       └── CheckRole.php               # role-based access
│   │   ├── Models/                             # 11 Eloquent models
│   │   └── Services/
│   │       └── ImageUploadService.php          # Cloudinary abstraction
│   ├── config/
│   │   ├── reverb.php                          # WebSocket config
│   │   ├── sanctum.php                         # API auth config
│   │   ├── cloudinary.php                      # Cloudinary config
│   │   └── cors.php                            # CORS config
│   ├── database/
│   │   ├── migrations/                         # 14 migration files
│   │   ├── factories/                          # 8 factories
│   │   └── seeders/
│   │       └── DatabaseSeeder.php              # demo data seeder
│   └── routes/
│       ├── api.php                             # all API routes
│       └── channels.php                        # broadcasting channels
│
├── frontend/                         # Next.js frontend
│   ├── app/
│   │   ├── (auth)/                    # Auth pages (group route)
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── dashboard/                 # Owner dashboard
│   │   │   ├── layout.tsx             # Sidebar layout + RoleGuard(owner)
│   │   │   ├── page.tsx               # Overview (analytics)
│   │   │   ├── front-desk/page.tsx    # Check-in/out + order management
│   │   │   ├── history/page.tsx       # Order history with filters
│   │   │   ├── portal/page.tsx        # Guest Portal CMS (full CRUD)
│   │   │   ├── rooms/page.tsx         # Room & QR management
│   │   │   ├── settings/page.tsx      # System settings (static/placeholder)
│   │   │   └── staff/page.tsx         # Staff CRUD
│   │   ├── reception/                 # Reception dashboard (mobile-first)
│   │   │   ├── layout.tsx             # RoleGuard(receptionist, owner)
│   │   │   ├── page.tsx               # Tabbed: Orders / Rooms / Stock
│   │   │   ├── orders-tab.tsx
│   │   │   ├── rooms-tab.tsx
│   │   │   └── stock-tab.tsx
│   │   ├── room/[token]/page.tsx      # Guest portal (QR code landing)
│   │   ├── print/                     # QR code print previews
│   │   │   ├── room/[id]/page.tsx
│   │   │   └── rooms/page.tsx
│   │   ├── globals.css                # Tailwind + design tokens
│   │   ├── layout.tsx                 # Root layout (fonts, Toaster)
│   │   └── page.tsx                   # Landing page (marketing)
│   ├── components/
│   │   ├── guest-portal/              # Guest portal UI components
│   │   │   ├── BottomNav.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── ExploreTab.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── HomeTab.tsx
│   │   │   ├── MenuTab.tsx
│   │   │   ├── RequestDrawer.tsx
│   │   │   ├── ServicesTab.tsx
│   │   │   └── SuccessDrawer.tsx
│   │   ├── manage-riad/               # CMS editor components
│   │   │   ├── ExcursionsTab.tsx
│   │   │   ├── GuestPortalPreview.tsx # Live mobile preview
│   │   │   ├── HouseRulesTab.tsx
│   │   │   ├── IconPicker.tsx
│   │   │   ├── MenuTab.tsx
│   │   │   ├── ServicesTab.tsx
│   │   │   └── SettingsTab.tsx
│   │   ├── notifications/            # Notification components
│   │   │   ├── NotificationBell.tsx
│   │   │   ├── NotificationDrawer.tsx
│   │   │   ├── NotificationItem.tsx
│   │   │   └── NotificationList.tsx
│   │   ├── ui/                        # shadcn/ui components
│   │   │   ├── ImageUploader.tsx      # Custom Cloudinary uploader
│   │   │   └── ... (30+ shadcn components)
│   │   ├── AnimatedOrderList.tsx
│   │   ├── QRCard.tsx
│   │   ├── RoleGuard.tsx
│   │   └── app-sidebar.tsx
│   ├── hooks/                         # Custom React hooks
│   │   ├── useAuth.ts                 # Login, register, logout, session
│   │   ├── useCatalog.ts              # Categories, menu, services, excursions, house rules
│   │   ├── useGuestPortal.ts          # Guest portal data fetch
│   │   ├── useGuestRequest.ts         # Guest request submission
│   │   ├── use-mobile.ts              # Mobile breakpoint detection
│   │   ├── useNotificationDrawer.tsx   # Drawer context
│   │   ├── useNotifications.ts        # Notifications + WebSocket
│   │   ├── useRequests.ts             # Guest requests + WebSocket
│   │   ├── useRooms.ts                # Rooms + WebSocket
│   │   ├── useSettings.ts             # Riad settings
│   │   └── useStaff.ts                # Staff CRUD
│   └── lib/
│       ├── api.ts                     # fetchApi wrapper (auth, CSRF, session)
│       ├── echo.ts                    # Laravel Echo (WebSocket) singleton
│       ├── notificationConfig.ts      # Notification icons, URLs, time grouping
│       ├── houseRuleIcons.ts          # Icon name → Lucide component map
│       ├── toast.tsx                  # Custom toast system (Sonner)
│       └── utils.ts                   # cn() utility (clsx + tailwind-merge)
│
└── .vscode/                           # VSCode workspace settings
```

---

## How to Run the Project

### Prerequisites

- PHP 8.3+
- Composer
- Node.js 20+
- MySQL (or SQLite for dev)
- Puppeteer/Chromium for PDF generation (Spatie Browsershot)

### Backend (Laravel)

```bash
cd backend

# Install dependencies
composer install
npm install

# Configure environment
cp .env.example .env    # or use existing .env
# Edit .env: DB credentials, Cloudinary URL, Reverb keys, etc.

# Generate app key (if needed)
php artisan key:generate

# Run migrations + seed demo data
php artisan migrate --seed

# Start development servers (all-in-one)
composer run dev

# Or start individually:
php artisan serve --host=0.0.0.0
php artisan queue:listen --tries=1 --timeout=0
php artisan reverb:start --host=0.0.0.0 --port=8080
```

### Frontend (Next.js)

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

The frontend assumes the backend is at `http://localhost:8000` (configurable via `NEXT_PUBLIC_API_URL` in `next.config.ts`).

### Environment Variables (Backend `.env`)

| Key | Value | Notes |
|---|---|---|
| `DB_CONNECTION` | `mysql` | Database driver |
| `DB_DATABASE` | `riadkit_db` | Database name |
| `FRONTEND_URL` | `http://localhost:3000` | CORS origin |
| `SANCTUM_STATEFUL_DOMAINS` | `localhost:3000,...` | SPA auth domains |
| `BROADCAST_CONNECTION` | `reverb` | WebSocket driver |
| `REVERB_APP_ID` | `919922` | Reverb app ID |
| `REVERB_APP_KEY` | `sgs4lxvi1draatx3avmf` | Reverb key |
| `REVERB_APP_SECRET` | `1vtnibck2zfs93psxdf9` | Reverb secret |
| `CLOUDINARY_URL` | `cloudinary://...` | Cloudinary connection |
| `SESSION_DRIVER` | `database` | Session storage |
| `QUEUE_CONNECTION` | `database` | Queue driver |
| `CACHE_STORE` | `database` | Cache driver |

### Environment Variables (Frontend `next.config.ts`)

| Key | Value | Notes |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Backend API URL |
| `NEXT_PUBLIC_REVERB_APP_KEY` | `sgs4lxvi1draatx3avmf` | Reverb key |
| `NEXT_PUBLIC_REVERB_HOST` | `localhost` | WebSocket host |
| `NEXT_PUBLIC_REVERB_PORT` | `8080` | WebSocket port |
| `NEXT_PUBLIC_REVERB_SCHEME` | `http` | WebSocket scheme |

### Demo Account

After running `php artisan migrate --seed`:
- **Email:** `owner@riadkit.test`
- **Password:** `password`
- **Riad:** Riad Jardin de Marrakech

---

## Architecture

### Backend Architecture

Laravel API-only backend (no Blade views). Exposes JSON endpoints under `/api/`. Authentication via Laravel Sanctum (Bearer tokens stored in cookies on the frontend).

**Multi-tenancy model:** Each `Riad` (tenant) has its own `riad_id` on all entities. Users belong to a riad with a `role` of `owner` or `receptionist`.

**Role-based access control:**
- `CheckRole` middleware checks `$request->user()->role` against allowed roles
- Three route groups: public, `auth:sanctum` (owner + receptionist), `auth:sanctum + role:owner`

**Broadcasting:** Laravel Reverb WebSocket server. All events implement `ShouldBroadcastNow`. Events are broadcast to private channel `riad.{riadId}.reception`. Four broadcast events:
- `NewNotification` → `.notification.created`
- `RequestCreated` → `.request.created`
- `RequestUpdated` → `.request.updated`
- `RoomStatusUpdated` → `.room.status.updated`

**Image management:** Cloudinary is used for all image storage. The `ImageUploadService` wraps upload/delete/replace. Only the public URL and public_id are stored in the database.

### Frontend Architecture

Next.js app router with `"use client"` components throughout (SPA-like). No server components or RSC patterns.

**State management:** No global state library (no Redux/Zustand). Custom hooks hold local state with `useState`/`useEffect`. Each hook is self-contained and fetches its own data.

**API client:** `lib/api.ts` — custom `fetchApi` wrapper that:
- Automatically injects the staff Bearer token from `riadkit_staff_token` cookie
- Manages guest `session_id` cookie for guest endpoints
- Handles 401 (redirect to login) and 403 (guest session expired)
- Sends `credentials: 'include'` for CORS

**WebSocket client:** `lib/echo.ts` — singleton Laravel Echo instance connected via Reverb. Auto-creates/recreates on token change.

**Optimistic updates:** `useCatalog.ts` uses a snapshot/rollback pattern for optimistic CRUD. `useRequests.ts` uses optimistic status updates with undo via toast.

### API Flow

1. Guest scans QR → `GET /api/guest/portal/{qr_token}` → returns riad info, menu, services, excursions, house rules
2. Guest submits request → `POST /api/guest/requests` → creates request, broadcasts `RequestCreated`
3. Reception sees it in real-time via WebSocket → updates status via `PATCH /api/requests/{id}` → broadcasts `RequestUpdated`
4. Owner manages catalog via CRUD endpoints under `auth:sanctum + role:owner`

### Authentication Flow

1. Owner registers → `POST /api/register` creates Riad + User in DB transaction → returns Sanctum token
2. Login → `POST /api/login` → validates credentials → returns Sanctum token
3. Token stored in `riadkit_staff_token` cookie (7-day expiry)
4. Auth check on mount: `GET /api/user` validates token
5. Logout clears cookie
6. Role-based redirect: owner → `/dashboard`, receptionist → `/reception`

### Guest Session Flow ("Sticky Token Defense")

1. Reception checks in guest → room status becomes `occupied`, a random 16-char `session_id` is generated and stored in `current_session_id`
2. Guest scans QR → `GuestPortalController` returns `session_id`, which frontend stores in `riadkit_session_id` cookie (no expiry — "sticky")
3. Guest places requests → backend validates session is active and matches the room
4. Checkout → session expires, guest can no longer place requests

---

## Database

### Migrations (14 files)

**`users`** — `id`, `riad_id` (FK → riads), `role` (owner/receptionist), `name`, `email`, `password`. Sanctum tokens stored in `personal_access_tokens` table.

**`riads`** — `id`, `name`, `subdomain`, `logo_url`, `logo_public_id`, `cover_image_url`, `cover_image_public_id`, `description`, `wifiName`, `wifiPassword`, `whatsappNumber`, `currency` (default MAD), `instagramUrl`.

**`rooms`** — `id`, `riad_id` (FK), `room_number`, `type`, `qr_token` (random token), `status` (vacant/occupied), `current_session_id`, `session_status` (active/expired).

**`categories`** — `id`, `riad_id` (FK), `name`, `type` (menu/service), `sort_order`. Indexed on `[riad_id, type]`.

**`menu_items`** — `id`, `riad_id` (FK), `category_id` (FK), `name`, `description`, `price`, `image_url`, `image_public_id`, `is_available`. Indexed on `riad_id`.

**`services`** — `id`, `riad_id` (FK), `category_id` (FK, nullable), `name`, `description`, `price` (nullable), `is_available`, `requires_quantity` (boolean). Indexed on `riad_id`.

**`excursions`** — `id`, `riad_id` (FK), `name`, `description`, `price`, `duration`, `image_url`, `image_public_id`, `is_available`. Indexed on `riad_id`.

**`guest_requests`** — `id`, `riad_id` (FK), `room_id` (FK), `session_id`, `type` (menu/service/excursion), `item_id`, `quantity` (default 1), `notes`, `status` (pending/in_progress/completed/cancelled). Indexed on `[riad_id, status]` and `session_id`.

**`house_rules`** — `id`, `riad_id` (FK), `title`, `description`, `value`, `icon` (default 'Info'), `is_active`, `sort_order`. Indexed on `riad_id`.

**`notifications`** — `id`, `riad_id` (FK), `type`, `title`, `description`, `is_read`, `data` (JSON). Indexed on `is_read`.

### Key Relationships

- `Riad` has many: `User`, `Room`, `Category`, `MenuItem`, `Service`, `Excursion`, `GuestRequest`, `HouseRule`, `Notification`
- `Room` belongs to `Riad`, has many `GuestRequest`
- `Category` belongs to `Riad`, has many `MenuItem` and/or `Service`
- `GuestRequest` belongs to `Riad` and `Room`

---

## UI Architecture

### Owner Dashboard (`/dashboard`)

Layout: `SidebarProvider` with `AppSidebar` (left nav) + header with `NotificationBell`. Wrapped in `RoleGuard` (owner only). Sticky header with breadcrumb.

Pages:
- **Overview** — revenue stats, bar chart (Recharts), out-of-stock items, recent activity, daily revenue log
- **Front Desk** — room check-in/out + order management with filter tabs (pending/in_progress/completed)
- **Order History** — full table with date range, room, status, type filters
- **Manage Riad (CMS)** — tabbed editor (Identity, Menu, Excursions, Services, House Rules) with live Guest Portal preview
- **Rooms & QR** — table with QR generation, print preview, PDF download
- **Settings** — static placeholder page (URL slug, currency, security, billing)
- **Staff** — CRUD table for receptionist accounts

### Reception Dashboard (`/reception`)

Mobile-first layout with bottom tab navigation. Wrapped in `RoleGuard` (receptionist or owner).

Tabs:
- **Orders** — filterable order list (pending/preparing/done) with status update buttons
- **Rooms** — occupancy overview with check-in/out buttons
- **Stock** — toggle item availability (menu/services/excursions)

### Guest Portal (`/room/[token]`)

Mobile-first, max-width `max-w-md`, centered on desktop. Full viewport height (`h-dvh`). Bottom tab navigation.

Tabs:
- **Home** — riad info, WiFi, contact, quick actions
- **Menu** — categories with items, request button
- **Explore** — excursions with details
- **Services** — services with quantity selector

Bottom sheet drawers for request confirmation and success.

### CMS (`/dashboard/portal`)

Two-column layout on desktop (editor left, preview right). Tabs:
- **Identity** — riad name, description, WiFi, WhatsApp, images, logo/cover upload
- **Menu** — categories + items CRUD with image upload
- **Excursions** — CRUD with image upload
- **Services** — CRUD with category assignment
- **House Rules** — CRUD with icon picker

### Shared Components

- **RoleGuard** — wraps children, checks user role, redirects if unauthorized
- **ImageUploader** — drag-and-drop Cloudinary uploader (5MB limit, JPG/PNG/WebP)
- **QRCard** — printable QR card component
- **AnimatedOrderList** — animated order list with status transitions
- **NotificationBell/Drawer/List/Item** — notification system with time grouping
- **GuestPortalPreview** — live mobile preview inside the CMS

---

## Coding Conventions

### Naming
- **Backend:** `snake_case` for DB columns, `camelCase` for methods, `PascalCase` for classes
- **Frontend:** `camelCase` for variables/functions, `PascalCase` for components/types, `kebab-case` for files
- **API routes:** `kebab-case` (`/api/menu-items`, `/api/house-rules`)

### Component Structure
- Pages: `app/{section}/page.tsx` (export default function)
- Components: `components/{category}/ComponentName.tsx`
- Hooks: `hooks/useHookName.ts`
- Always `"use client"` on interactive components
- Named exports for components, default exports for pages

### API Patterns
- Centralized `fetchApi` wrapper in `lib/api.ts`
- Custom hooks for each data domain (useRooms, useRequests, useCatalog, etc.)
- Hooks handle loading/error states internally
- Optimistic updates with rollback on failure
- WebSocket listeners inside hooks via `getEcho()`

### Error Handling
- Backend: returns JSON errors with appropriate HTTP status codes
- Frontend: `fetchApi` throws `{ status, data, message }` objects
- Hooks expose `error` state (string | null)
- Components show inline errors or use `toast.error()`

### Styling
- Tailwind CSS 4 with CSS variables for design tokens (defined in `globals.css`)
- Color palette: background `#FAF8F5`, primary `#A63D40`, secondary `#E9D8C5`, foreground `#2B2B2B`, muted `#666666`, border `#EEE6DD`
- Fonts: Geist (sans), Geist Mono (mono), Playfair Display (heading)
- `cn()` utility from `lib/utils.ts` for class merging
- Bold/uppercase labels for UI text (`font-black uppercase text-xs tracking-widest`)
- Rounded corners (`rounded-xl`, `rounded-2xl`, `rounded-full`)
- Cards with border and subtle shadow

### Folder Organization
- Components organized by domain (`guest-portal/`, `manage-riad/`, `notifications/`, `ui/`)
- Hooks by feature (`useRooms`, `useCatalog`, etc.)
- Dashboard pages under `app/dashboard/`
- Auth pages under `app/(auth)/`

### Backend Conventions
- Controllers: thin, use Eloquent directly
- No Form Request classes — validation inline in controllers
- No API Resource classes — responses shaped inline
- No Notification classes — custom notification table + broadcasting
- Events implement `ShouldBroadcastNow`

---

## Existing Features

### Rooms
CRUD operations for rooms. Each room has a unique `qr_token` generated on creation. Status tracking (vacant/occupied) with `current_session_id` for guest sessions.

### QR Codes
Generate QR codes per room. Print preview pages (single and batch). PDF download via Browsershot. QR data = `{origin}/room/{token}`.

### Guest Portal
Mobile web app accessible by scanning QR code. Shows riad info (name, description, WiFi, WhatsApp), menu with categories, excursions, services, and house rules.

### Menu
Categories (typed: menu/service) with menu items. Each item has name, description, price, image (Cloudinary), availability toggle.

### Excursions
Name, description, price, duration, image (Cloudinary), availability toggle.

### Services
Name, description, price (nullable for complimentary), category assignment, quantity selector, availability toggle.

### House Rules
Title, description, value, icon (chosen from ~40 Lucide icons), active toggle, sort order.

### Guest Requests
Guests submit requests (menu/service/excursion). Status flow: pending → in_progress → completed/cancelled. Real-time updates via WebSocket.

### Check-in/Check-out
Reception (or owner from Front Desk) manages room occupancy. Check-in generates session ID. Check-out expires session.

### Notifications
System notifications for all CRUD operations, room events, order status changes. Real-time via WebSocket. Grouped by time (today/yesterday/this week/earlier).

### Image Uploads
Cloudinary-based upload system. Supports folders: `riads/logos`, `riads/covers`, `menu-items`, `excursions`. Upload immediately but only persisted on save.

### Staff Management
Owner can create/update/delete receptionist accounts. Temporary credentials shown on creation.

### Revenue Analytics
Dashboard overview with today's revenue (vs yesterday), active rooms, order status counts, 7-day revenue history, 6-month bar chart (Recharts).

### Order History
Full order history table with date range, room, status, and type filters.

### PDF QR Print
Single room and batch PDF generation via Spatie Browsershot (Puppeteer).

### Multi-tenancy
All data scoped by `riad_id`. Users belong to a specific riad.

---

## Important Decisions

- **Cloudinary stores only original images.** URLs and public IDs are stored in the database. Cloudinary handles transformations and delivery.
- **Services and House Rules use icons instead of images.** Services have no image field. House rules use Lucide icon names mapped via `houseRuleIcons.ts`.
- **Images upload immediately but are persisted only when the owner clicks Save Changes.** The `ImageUploader` component uploads to Cloudinary on file selection. The resulting URL/public_id is stored in local form state; it's only saved to the database when the form is submitted.
- **Notification system uses WebSockets.** All CRUD operations dispatch `NewNotification` events. The frontend receives them in real-time via Laravel Echo.
- **CMS includes a live Guest Portal preview.** The right-hand column in the CMS renders actual guest portal components with current data, reflecting changes as the owner edits.
- **Guest sessions use "Sticky Token Defense."** The session ID cookie has no expiry. Once a session is expired (checkout), the backend rejects requests even if the cookie persists.
- **No global state management.** Each hook is self-contained. Data is refetched on mount and updated via WebSocket events.
- **Optimistic updates with rollback.** `useCatalog.ts` saves a snapshot before mutations and rolls back on failure.
- **Reception dashboard is mobile-first** with bottom navigation (tab bar), while the owner dashboard is desktop-first with sidebar.
- **Backend uses `ShouldBroadcastNow`** for instant WebSocket delivery (no queue delay for broadcasts).
- **No Form Request or API Resource classes.** Validation and response shaping are done inline in controllers.
- **Scribe generates API docs at `/docs`** (OAS 3.0.3 + Postman collection).

---

## Things To Avoid

- **Do not introduce a global state library** (Redux, Zustand, etc.). The hook-per-domain pattern is working.
- **Do not add Form Request or API Resource classes** unless the project explicitly adopts them. Current convention is inline.
- **Do not duplicate API logic.** All API calls go through `lib/api.ts`. All data fetching is in custom hooks.
- **Do not duplicate upload logic.** Use `ImageUploader` component and `ImageUploadService` on the backend.
- **Do not introduce full page refreshes.** All navigation is client-side. API calls are async.
- **Do not duplicate components.** Check existing components before creating new ones (especially UI components from shadcn).
- **Do not duplicate notification/event dispatching logic.** Follow the pattern in existing controllers.
- **Do not break the existing design system.** Use the CSS variables from `globals.css` and shadcn components.
- **Do not create unnecessary state duplication.** Hooks fetch their own data. Pass data via props when needed.
- **Do not change the guest session flow** ("Sticky Token Defense") without understanding it fully.
- **Do not use server components or RSC patterns.** The project uses `"use client"` throughout.
- **Do not add new database tables without understanding multi-tenancy.** All entities must have `riad_id`.
- **Do not remove `credentials: 'include'` from `fetchApi`** — it's required for CORS with Sanctum.

---

## Development Notes

- **Reuse existing components** — check `components/` before creating new ones.
- **Inspect existing implementations** before creating new features. Follow the same patterns.
- **Keep performance in mind** — avoid unnecessary re-renders, use `useMemo`/`useCallback` where appropriate.
- **Avoid unnecessary refactors** — the project is early-stage and conventions are still being established.
- **When creating new hooks** — follow the pattern: loading state, error state, data state, fetch function in `useCallback`, `useEffect` on mount.
- **When creating new pages** — follow the layout pattern: header with title/description, then content.
- **When adding new WebSocket events** — follow the existing pattern: backend event class, broadcast channel, frontend listener in hook.
- **The `proxy.ts` file at frontend root exists but is NOT wired as middleware** — it's not renamed to `middleware.ts`, so it's not active. Auth redirects are handled client-side by `useAuth`.
- **The `public/sounds/notification.mp3` file is missing** — the `useRequests.ts` hook references it but handles the 404 gracefully.
- **The `types/` directory is empty** — all types are defined within their respective hooks and components.
- **Check `node_modules/next/dist/docs/` before writing Next.js code** (per `AGENTS.md`) — Next.js 16 may have breaking changes.
