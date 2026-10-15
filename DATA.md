
# Addis Eats — Data Layer

## Shared fetcher

`src/lib/fetcher.js` — one function used by every `useSWR` call.
Throws on non-OK responses with `err.status` attached so SWR
populates `error`.

## Every query

| Data | Side | Key / source | Refresh rule | Reasoning |
|---|---|---|---|---|
| Menu (initial) | Server | `getActiveDishes()` | `revalidate: 60s` | Public, cacheable, indexable |
| Menu (client nav) | Client | `/api/dishes?page=&category=` | none | Catalog is stable; caching headers handle freshness |
| Menu search | Client | `/api/dishes?q=&page=&category=` | none; debounced 300ms | Null key when term is empty — SWR skips the request |
| Dish detail | Server | `getDish(id)` | SSG via `generateStaticParams` | Prerendered at build |
| Order status (page) | Server | `getOrder(id)` | per-request | Ownership check needs session |
| Order status (poll) | Client | `/api/orders/${id}` | `refreshInterval: 5000` | Live status; seeded with `fallbackData` |
| Order status (stream) | Client | `/api/orders/${id}/stream` (SSE) | live push | Server sends status changes; client closes on delivery |
| Order list | Server | `listOrdersForUser(session.userId)` | per-request + 15s poll | Private; owner-scoped |
| CSV export | Client | `/api/orders/export` | on click | Fresh CSV every time |
| Dashboard | Server | `listAllOrders()` + aggregations | per-request | Aggregated on server, only summaries cross the client boundary |
| Admin dish list | Server | `getDishes()` | per-request | Staff must see disabled dishes too |
| Favorites | Server + client | `getActiveDishes()` + `localStorage` | on toggle | Dishes from server, saved ids from browser |
| Cart | Client | React context | — | Never leaves the browser until checkout |

## Server → client seeding

Three pages seed client components with server data so first paint
has real content:

- `/menu` → `MenuBrowser` gets `fallbackData` from the server page
- `/orders/[id]` → `OrderStatus` gets `fallbackData` from the server page
- `/track/[id]` → `TrackingView` gets coordinates and initial status

In every case, the user sees real content before any network request.

## What is NOT polled

- Dishes — stable; cache headers handle freshness
- Cart — client-only, no server round-trip
- Order history — server-rendered per request, refreshed every 15s
  while the tab is visible

## Order status sync (admin → customer)
