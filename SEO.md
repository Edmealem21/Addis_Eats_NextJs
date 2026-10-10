# Addis Eats — SEO Reference

## Metadata defaults (`app/layout.js`)

| Field | Value |
|---|---|
| metadataBase | `${SITE_URL}` — resolves relative URLs |
| title.default | `Addis Eats — Authentic Ethiopian Food, Delivered` |
| title.template | `%s — Addis Eats` |

## Per-route metadata

| Route | Title | Canonical |
|---|---|---|
| `/` | `Home — Addis Eats` | `/` |
| `/menu` | `Menu — Addis Eats` | `/menu` (all pages point here) |
| `/menu/[id]` | `Doro Wat — Addis Eats` | `/menu/doro-wat` |
| `/signin` | `Sign in — Addis Eats` | `/signin` |

## Private routes (noindex, nofollow, disallowed)

`/cart`, `/checkout`, `/orders`, `/orders/[id]`, `/kitchen`, `/signin`

Excluded from sitemap. Disallowed in robots.txt. Every one carries `<meta name="robots" content="noindex, nofollow">`.

## Open Graph images (1200 × 630)

| Image | Source file |
|---|---|
| Site-wide | `app/opengraph-image.jsx` |
| Site-wide (Twitter) | `app/twitter-image.jsx` (re-export) |
| Per dish | `app/menu/[id]/opengraph-image.jsx` |
| Per dish (Twitter) | `app/menu/[id]/twitter-image.jsx` (re-export) |

## Structured data

**`/menu`** — `CollectionPage` with `hasPart: [MenuItem]`
**`/menu/[id]`** — `MenuItem` with name, description, image, `offers.price`, `offers.priceCurrency: "ETB"`

Both generated from the same dish objects the page renders.

## Sitemap

`app/sitemap.js` returns `/`, `/menu`, and one entry per dish.
Private routes absent by construction.

## Robots

`app/robots.js` disallows `/cart`, `/checkout`, `/orders`, `/kitchen`, `/api`. Points at `/sitemap.xml`.

## Verification

- **View page source (Ctrl+U)** — not the DevTools Elements panel
- Preview: opengraph.xyz, cards-dev.twitter.com, linkedin.com/post-inspector
- Structured data: search.google.com/test/rich-results