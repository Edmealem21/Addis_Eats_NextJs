# Addis Eats — Data Layer

## Shared fetcher

`src/lib/fetcher.js` — throws on non-OK responses so SWR populates `error`.

## Every query

| Data | Side | Key / source | Refresh rule | Reasoning |
|---|---|---|---|---|
| Menu (initial) | Server | `getDishes()` | revalidate 60s | Public, cacheable, indexable. Seeded as `fallbackData`. |
| Menu (client nav) | Client | `/api/dishes?page=${n}` | none | Paging is user-triggered; catalog is stable. |
| Menu search | Client | `/api/dishes?q=${term}&page=${n}` | none; debounced 300ms | Null key when term is empty — SWR skips the request. |
| Dish detail | Server | `getDish(id)` | SSG via `generateStaticParams` | Prerendered at build. |
| Order status page | Server | `getOrder(id)` | per-request | Ownership check needs the session. |
| Order status (poll) | Client | `/api/orders/${id}` | `refreshInterval: 5000` | Live data. Seeded with `fallbackData`. |
| Order status (stream) | Client | `/api/orders/${id}/stream` (SSE) | live | Server pushes status changes; client closes on delivery. |
| Order history | Server | `listOrdersForUser(session.userId)` | per-request | Private, scoped to session. |
| CSV export | Client | `/api/orders/export` | on click | Fresh CSV every time. |
| Dashboard data | Server | `listAllOrders()` + aggregations | per-request | Aggregated on the server; only summaries cross to the client. |
| Cart contents | Client | React context | — | Never leaves the browser until checkout. |

## Server → client seeding

- `/menu` → `MenuBrowser` gets `fallbackData` from the server page.
- `/orders/[id]` → `OrderStatus` gets `fallbackData` from the server page.
- `/track/[id]` → `TrackingView` gets `initialStatus` and coordinates.

In all three cases, the user sees real content on first paint. The fetch is
a refresh, not the initial load.

## What is NOT polled

- Dishes — stable; cache headers handle freshness.
- Cart — client-only.
- Order history — server-rendered per request.