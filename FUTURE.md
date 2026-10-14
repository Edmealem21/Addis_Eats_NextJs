# FUTURE.md — What Was Cut

Everything below was considered and deliberately not built. This is a
judgement list, not an oversight list.

## Must (complete — verified)

- Sign in / sign out with session cookies
- Menu browsing, search, paging
- Cart add / remove / clear
- Checkout with server validation
- Order history (own orders only)
- Order tracking with live map + SSE status
- Staff dashboard with revenue and orders-per-day charts
- Accessibility: keyboard nav, focus rings, 44 px targets
- No double-submit on Place order
- Deployed to Vercel with per-environment env vars

## Should (partial)

- Roll your own kitchen workflow (currently read-only) — deferred
- Real courier GPS integration — the map position is simulated from
  status
- Order cancellation UI (action exists, no button)

## Could (cut)

- Payment integration — out of scope for the module
- Multi-language (Amharic) UI — needs translation infrastructure
- Push notifications for order status — needs service worker
- Dark mode toggle — pure polish
- Mapbox tiles with a custom style — Leaflet + OSM is sufficient
- Search autocomplete from previous queries — no data to base it on
- Order rating / reviews — not part of the delivery flow

## Why these were cut

Time-boxed to one session. Every "Could" costs attention that is better
spent verifying the Musts on the deployed URL. A finished, verified app
with fewer features scores higher than an ambitious half-built one.