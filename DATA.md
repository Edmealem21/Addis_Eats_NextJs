# Addis Eats — Data Layer

## Shared fetcher

`src/lib/fetcher.js` — one function, used by every `useSWR` call. Throws on non-OK responses with `err.status` attached.

## Every query

| Data | Server or Client | Key / source | Refresh rule | Reasoning |
|---|---|---|---|---|
| Menu (initial page) | **Server** | `getDishes()` from `lib/dishes.js` | revalidate 60s | Public, cacheable, indexable. Seeded as `fallbackData`. |
| Menu (client navigation) | **Client** | `/api/dishes?page=${n}` | none | Search/paging is user-triggered. Catalog stable; CDN caches 60s. |
| Menu search | **Client** | `/api/dishes?q=${term}&page=${n}` | none; debounced 300ms | Only fires when user types. `null` key when term empty. |
| Dish detail | **Server** | `getDish(id)` | SSG via `generateStaticParams` | Prerendered at build; refreshed every 60s. |
| Order status | **Client** | `/api/orders/${id}` | `refreshInterval: 5000` | Live data. Server seeds first paint via `fallbackData`. |
| Order history | **Server** | `listOrdersForUser(session.userId)` | per-request | Private, scoped to session. No client fetch. |
| Cart contents | **Client** | React context | — | Never leaves the browser until checkout. |

## Server → client seeding (the "no spinner" rule)

- `/menu` → `MenuBrowser` receives `fallbackData` from the server page.
- `/orders/[id]` → `OrderStatus` receives `fallbackData` from the server page.

In both cases the user sees real data on first paint. The SWR fetch is a refresh, not the initial load.

## What is NOT polled

- Dishes — stable data; caching headers handle freshness.
- Cart — client-only.
- Order history — server-rendered per request; no client fetch needed.