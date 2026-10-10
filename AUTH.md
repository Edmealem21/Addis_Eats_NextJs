# Addis Eats — Authentication

## Session model

- Cookie `session`: `base64(payload).HMAC-SHA256(payload)`
- Payload: `{ userId, role }`
- Secret: `SESSION_SECRET`
- Flags: `httpOnly`, `secure` (prod), `sameSite=lax`, `path=/`, `maxAge=1d`

## Protected routes — every layer

| Route / action | Layer 1 (middleware) | Layer 2 (page/session) | Layer 3 (data/ownership) | Proves |
|---|---|---|---|---|
| `/checkout` | cookie present | `getSession()` verifies signature | `placeOrder` derives `userId` from session | Signed-in + write not forged |
| `/orders` | cookie present | `getSession()` | `listOrdersForUser(session.userId)` | Only own orders returned |
| `/orders/[id]` | cookie present | `getSession()` | `order.userId === session.userId` else `notFound()` | Cross-account read impossible |
| `/kitchen` | — | `getSession()` | `session.role === "staff"` else redirect | Role enforced server-side |
| `POST /api/orders` | — | `getSession()` | schema validation | 401 for signed-out |
| `GET /api/orders/[id]` | — | `getSession()` | `order.userId === session.userId` else 404 | Cross-account via API impossible |

## The three attacks and what refused them

### Attack 1 — Cookie tampering
**Do:** Modify one character in the `session` cookie in DevTools. Reload `/checkout`.
**Result:** Redirected to `/signin`.
**Which line refused it:** `verify()` in `src/lib/session.js:38` — `timingSafeEqual` on the HMAC failed, `getSession()` returned `null`, the page called `redirect("/signin?next=/checkout")`.

### Attack 2 — Cross-account read
**Do:** Sign in as `user-1`. Place an order. Note the id. Sign out. Sign in as `user-2`. Visit `/orders/<user-1-order>`.
**Result:** 404.
**Which line refused it:** `src/app/orders/[id]/page.js:16` — `if (order.userId !== session.userId) notFound()`. 404 (not 403) so nothing leaks.

### Attack 3 — Open redirect
**Do:** While signed out, visit `/signin?next=https://evil.example.com/phish`. Sign in.
**Result:** Landed on `/`.
**Which line refused it:** `safeNext()` in `src/app/signin/page.js:8` — rejects any value not starting with a single `/`.

## What each layer proves (the point)

- **Middleware** — proves a cookie exists. Cheap. Runs on every matched request. Not sufficient alone.
- **`getSession()` on the page** — proves the cookie signature is valid and unexpired.
- **The query or ownership check** — proves the caller is allowed to touch **this specific record**, not just any record.

A missing layer 3 is the classic vulnerability: the app knows you're signed in but not which records are yours. Every `getOrder(id)` in the codebase must be preceded by a session check **and** an ownership check.