# � RiadKit API Documentation

The RiadKit backend is a Laravel 11 REST API. It is divided into two main parts:
1. **Protected Owner/Staff API** (Secured via Laravel Sanctum).
2. **Public Guest API** (Secured via QR Tokens and Sticky Session Defense).

**Base URL:** `http://192.168.100.53:8000/api`

---

## �️ Authentication

Riad owners and reception staff must authenticate to manage the Riad.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/register` | Creates a new Riad and User (Owner). Returns a Bearer Token. |
| `POST` | `/login` | Authenticates an existing user and returns a Bearer Token. |
| `GET` | `/user` | Returns the currently authenticated user payload. *(Requires Token)* |

> **Note on Authentication:** For all protected routes below, include the header: 
> `Authorization: Bearer {your_token_here}`

---

## �️ Live Reception Desk & Rooms *(Protected)*

Manage physical rooms and handle guest check-ins, check-outs, and real-time orders.

### Room Operations
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/rooms` | List all rooms for the Riad, including `is_active` status and `qr_token`. |
| `POST` | `/rooms` | Add a physical room. Automatically generates a secure 16-char `qr_token`. |
| `POST` | `/rooms/{room}/checkin` | Checks a guest in. Updates status to `Occupied` and generates a new `current_session_id`. |
| `POST` | `/rooms/{room}/checkout` | Checks a guest out. Updates status to `Vacant` and expires the session. |

### Live Request Feed
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/requests` | Fetch all `pending` and `in_progress` guest requests for the Live Desk. |
| `PATCH` | `/requests/{id}` | Update a request status (e.g., mark as `completed` or `cancelled`). |

---

## �️ Menus, Services & Excursions *(Protected)*

Standard CRUD operations for the Riad's offerings. All queries are automatically scoped to the authenticated user's `riad_id` for strict multi-tenant security.

| Method | Endpoints (Base) | Features |
| :--- | :--- | :--- |
| `GET`, `POST`, `PUT`, `DEL` | `/categories` | Group items into Menus or Services. |
| `GET`, `POST`, `PUT`, `DEL` | `/menu-items` | Food and beverage items with pricing. |
| `GET`, `POST`, `PUT`, `DEL` | `/services` | In-house requests (e.g., Towels, Cleaning). Includes a `requires_quantity` toggle. |
| `GET`, `POST`, `PUT`, `DEL` | `/excursions` | Local tours with duration and pricing. |

---

## � Guest Portal *(Public / Session Secured)*

These routes are accessed by guests scanning the QR code in their room. They do not use standard login tokens; instead, they rely on our **Sticky Token Defense**.

### 1. Bootstrap the Portal
`GET /guest/portal/{qr_token}?session_id={cookie_session_id}`

This is the single-request workhorse for the Next.js frontend.
* **If `session_id` matches the room's active session:** Returns the Riad details, Menus, Services, Excursions, and `session_status: "active"`.
* **If `session_id` does NOT match or is missing:** Returns the data so they can still browse, but sets `session_status: "expired"` (disabling ordering UI).

### 2. Submit a Request
`POST /guest/requests`

Allows an active guest to order food, request services, or book excursions.

**Request Body:**
```json
{
  "qr_token": "A1B2C3D4E5F6G7H8",
  "session_id": "random16charSession",
  "type": "menu", // 'menu', 'service', or 'excursion'
  "item_id": 12,
  "quantity": 2,
  "notes": "No sugar in the mint tea, please."
}
```
**Sticky Token Defense in Action:** 
If a guest checks out, the room's session ID changes. If the old guest tries to hit this endpoint using their old `session_id` cookie, the API intercepts it and returns `403 Forbidden`, preventing them from sending fake requests to the new guest's room.