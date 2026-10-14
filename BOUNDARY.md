
# Addis Eats — Server / Client Boundary

Every component: which side it runs on, and one line justifying the choice.

## Rules applied

1. **Default to Server.** A component starts as a server component unless
   something forces it to be client.
2. **Directive on the leaf.** `"use client"` sits on the smallest component
   that needs `useState`, `useEffect`, an event handler, or a browser API.
3. **No callbacks across the boundary.** A server component never passes a
   function to a client one. `children` is the only channel for handing
   server content down.
4. **Framework rules override.** `error.js` must be a client component
   regardless of what it renders.

## Component inventory

### Root and layout

| Component | Side | Why |
|---|---|---|
| `app/layout.js` | Server | Renders `<html>`/`<body>`/header/footer; no hooks. |
| `components/Providers.jsx` | **Client** | Owns cart state via `useState`. Wraps `children` so server content passes through. |
| `components/CartContext.jsx` | **Client** | `createContext` and `useContext` are client-only. |
| `components/CartButton.jsx` | **Client** | Reads cart count from context. |
| `components/CartLines.jsx` | **Client** | Reads items, calls `removeItem`/`clear`. |
| `components/AddToCartButton.jsx` | **Client** | Has an `onClick` that writes to the cart. |
| `components/SignOutButton.jsx` | **Client** | Submits to `signOutAction`. |
| `components/MobileNav.jsx` | **Client** | `useState` for open/closed, `usePathname` to close on navigation, `useEffect` for outside-click and Escape. |
| `components/HeaderUser.jsx` | **Client** | Fetches the session after hydration so the layout can stay static. |
| `components/DishCard.jsx` | Server | Pure markup — `<Link>` and `<Image>`. No state, no handlers. |
| `components/AnalyticsScript.jsx` | **Client** | Uses `next/script` to control strategy. |
| `components/ExportButton.jsx` | **Client** | Fetches the CSV endpoint on click. |

### Menu route

| Component | Side | Why |
|---|---|---|
| `app/menu/layout.js` | Server | Arranges the category sidebar grid. |
| `app/menu/page.js` | Server | Async; awaits `getDishes()`; reads `searchParams`. |
| `app/menu/MenuBrowser.jsx` | **Client** | `useSWR` for search/paging, `useState` for the term. |
| `app/menu/SearchBox.jsx` | **Client** | `useState` for input, `useEffect` for the debounce timer. |
| `app/menu/Pager.jsx` | **Client** | Uses `next/link` and `useSearchParams` to build paged URLs. |
| `app/menu/DishList.js` | Server | Renders the grid of `<DishCard>`s. |
| `app/menu/loading.js` | Server | Static skeleton. |
| `app/menu/error.js` | **Client** | Next requires error boundaries to be client. |
| `app/menu/[id]/page.js` | Server | Async; awaits `getDish(id)`; emits JSON-LD. |

### Orders and tracking

| Component | Side | Why |
|---|---|---|
| `app/orders/page.js` | Server | Reads `searchParams`, awaits `listOrdersForUser`. |
| `app/orders/OrderTable.jsx` | Server | Table markup; column headers are `<Link>`s. |
| `app/orders/loading.js` | Server | Five-row skeleton. |
| `app/orders/[id]/page.js` | Server | Awaits `getOrder(id)`; ownership check. |
| `app/orders/[id]/OrderStatus.jsx` | **Client** | `useSWR` polls the status every 5s. |
| `app/track/[id]/page.js` | Server | Reads the order, computes coordinates. |
| `app/track/[id]/TrackingView.jsx` | **Client** | Owns the `EventSource` connection. |
| `app/track/[id]/TrackingPanel.jsx` | **Client** | Renders the live status list. |
| `app/track/[id]/MapWrapper.jsx` | **Client** | Loads `DeliveryMap` with `ssr: false`. |
| `app/track/[id]/DeliveryMap.jsx` | **Client** | Leaflet + `react-leaflet`; browser-only. |

### Dashboard

| Component | Side | Why |
|---|---|---|
| `app/dashboard/page.js` | Server | Aggregates orders; passes summaries only. |
| `app/dashboard/RevenueChart.jsx` | **Client** | SVG chart rendered in the browser. |
| `app/dashboard/OrdersLineChart.jsx` | **Client** | SVG chart. |
| `app/dashboard/ChartDataTable.jsx` | Server | Fallback table rendered on the server. |
| `app/dashboard/loading.js` | Server | Skeleton. |
| `app/dashboard/error.js` | **Client** | Error boundary. |

### Auth, cart, and checkout

| Component | Side | Why |
|---|---|---|
| `app/signin/page.js` | Server | Reads `searchParams.next`. |
| `app/signin/SignInForm.jsx` | **Client** | `useActionState` drives the form. |
| `app/cart/page.js` | Server | Renders the shell + `<CartLines>`. |
| `app/checkout/page.js` | Server | Verifies session, wraps the form. |
| `app/checkout/CheckoutForm.jsx` | **Client** | `useActionState` + cart state + double-submit lock. |

### Server-only modules

| File | Why server-only |
|---|---|
| `lib/session.js` | Imports `next/headers` (`cookies`). |
| `lib/users.js` | Contains plaintext demo passwords. |
| `lib/schema.js` | Shared with `actions.js` and `api/orders`. |
| `lib/dishes.js` | Data source; imported by server components. |
| `lib/orders.js` | Server-side order store. |
| `lib/seed.js` | Server-side seeding logic. |
| `lib/geo.js` | Server-side coordinate lookup. |
| `lib/site.js` | Env-var reads; safe on either side, but only used server-side. |
| `lib/format.js` | Pure functions — safe on either side. |
| `lib/csv.js` | `toCsv` works anywhere; `downloadCsv` is client-only (uses `document`). |
| `lib/fetcher.js` | Used by client SWR calls; ships to browser. |
| `app/actions.js` | `"use server"`. |
| `app/api/**/route.js` | Route handlers. |

## Verifying the boundary

```bash
grep -rl '"use client"' src/