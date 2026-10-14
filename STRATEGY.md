
# Addis Eats — Rendering Strategy

One line per route, explaining the choice. Answers three questions for
every route:

1. **Who is asking?** If nobody in particular → static.
2. **How stale may it be?** If minutes or hours → revalidate.
3. **Does it read the request?** If yes (cookies, headers, searchParams) →
   dynamic.

## Route table

| Route | Marker | Strategy | Reasoning |
|---|---|---|---|
| `/` | ○ | Static | Marketing content; same HTML for everyone. |
| `/menu` | ƒ | Dynamic | Reads `searchParams` for `?page=`. |
| `/menu/[id]` | ● | SSG | `generateStaticParams` prerenders each dish. |
| `/cart` | ○ | Static shell | Cart lines render on the client from context. |
| `/checkout` | ƒ | Dynamic | Calls `getSession()`, which reads cookies. |
| `/orders` | ƒ | Dynamic | Session-scoped query. |
| `/orders/[id]` | ƒ | Dynamic | Per-order ownership check. |
| `/track/[id]` | ƒ | Dynamic | Ownership check + SSE stream. |
| `/dashboard` | ƒ | Dynamic | Aggregates live order data. |
| `/kitchen` | ƒ | Dynamic | Role check reads the session. |
| `/signin` | ○ | Static | Reads `searchParams.next` server-side. |
| `/not-found` | ○ | Static | Same 404 HTML for everyone. |
| `/opengraph-image` | ○ | Static | Generated once at build. |
| `/menu/[id]/opengraph-image` | ● | Generated per dish | One image per dish. |
| `/robots.txt` | ○ | Static | Generated at build. |
| `/sitemap.xml` | ○ | Static | Generated at build. |
| `/api/dishes` | ƒ | Dynamic | Reads URL search params. |
| `/api/dishes/[id]` | ƒ | Dynamic | Reads URL segment. |
| `/api/orders` | ƒ | Dynamic | Reads cookies and body. |
| `/api/orders/[id]` | ƒ | Dynamic | Reads cookies and segment. |
| `/api/orders/[id]/stream` | ƒ | Dynamic | SSE endpoint; never cached. |
| `/api/orders/export` | ƒ | Dynamic | Reads cookies; returns CSV. |

**Marker legend:** ○ Static · ● Prerendered from params · ƒ Dynamic

## Reading the markers

Run `npm run build` and compare the route table against this file. Every
marker should match.

| Symptom | Cause | Fix |
|---|---|---|
| ○ where you wanted ƒ | A missing `cookies()` / `searchParams` read | Add the read (or set `dynamic = "force-dynamic"`) |
| ƒ where you wanted ○ | A cookie/header read in a shared layout or lib | Move it into a client component |
| First Load JS jumped | A `"use client"` spread further than intended | Check `BOUNDARY.md` |

## Why `/menu` is dynamic

The menu page reads `searchParams.get("page")` to render the correct slice.
Next cannot prerender every paginated URL, so the route is marked ƒ.

Trade-off accepted: `/menu` could be static if pagination were entirely
client-side, but that would break refresh on `/menu?page=3` and lose the
shareable URL.

## Why `/orders/[id]` and `/track/[id]` are not SSG

Order ids are created at runtime. `generateStaticParams` cannot enumerate
them. The pages render dynamically so ownership checks can run on every
request.

## Why the root layout does not read cookies

Earlier versions called `getSession()` in `app/layout.js`. That made
**every** route dynamic — even the home page and 404 — because the layout
wraps all of them.

The fix was to move the session read into `components/HeaderUser.jsx`, a
client component that fetches `/api/me` after hydration. Now the layout is
static, and only the routes that genuinely need the session remain
dynamic.

## Middleware

`middleware.js` runs on exactly three path patterns:

```js
export const config = {
  matcher: ["/checkout", "/orders", "/orders/:path*"],
};