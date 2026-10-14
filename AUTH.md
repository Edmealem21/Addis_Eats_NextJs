# Addis Eats — Authentication

## Session model

- Cookie `session` holds `base64(payload).HMAC-SHA256(payload)`.
- Payload: `{ userId, role }`.
- Secret: `SESSION_SECRET` env var.
- Cookie flags: `httpOnly`, `secure` (production), `sameSite=lax`,
  `path=/`, `maxAge=1 day`.

## Protected routes — every layer

| Route | Layer 1 (middleware) | Layer 2 (page) | Layer 3 (data) | Proves |
|---|---|---|---|---|
| `/checkout` | cookie present | `getSession()` verifies signature | `placeOrder` derives `userId` from session | signed-in, write cannot be forged |
| `/orders` | cookie present | `getSession()` | `listOrdersForUser(session.userId)` | only own orders returned |
| `/orders/[id]` | cookie present | `getSession()` | `order.userId === session.userId` else `notFound()` | cross-account read returns 404 |
| `/track/[id]` | (no middleware) | `getSession()` | ownership check | cross-account track returns 404 |
| `/dashboard` | (no middleware) | `getSession()` | (not user-scoped; staff-only) | signed-in only |
| `/kitchen` | (no middleware) | `getSession()` | `role === "staff"` | staff-only |
| `POST /api/orders` | (no middleware) | — | `getSession()` + schema validation | 401 for signed-out |
| `GET /api/orders/[id]` | (no middleware) | — | `getSession()` + ownership | 401/404 |
| `GET /api/orders/[id]/stream` | (no middleware) | — | `getSession()` + ownership | 401/404 |
| `GET /api/orders/export` | (no middleware) | — | `getSession()` | 401 |

**Middleware matcher:** `["/checkout", "/orders", "/orders/:path*"]` — narrow by design.
Sign-in is not matched (would loop). `/kitchen`, `/dashboard`, `/track`
handle their own checks on the server.

## Server Actions — both checks inside every write

### `placeOrder(prevState, formData)`

1. `getSession()` — reject if null.
2. `orderSchema.safeParse(raw)` — reject on validation failure.
3. `userId: session.userId` — **from session, never from form**.
4. `addOrder(...)`, then `revalidatePath`.

### `cancelOrder(prevState, formData)`

1. `getSession()` — reject if null.
2. Load the order — reject if not found.
3. `if (order.userId !== session.userId)` — reject.
4. `deleteOrder(id)`, then `revalidatePath`.

## `next` parameter validation

```js
function safeNext(value) {
  if (typeof value !== "string") return "/";
  if (!value.startsWith("/")) return "/";
  if (value.startsWith("//")) return "/";
  return value;
}