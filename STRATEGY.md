# Addis Eats — Rendering Strategy

| Route | Strategy | Marker | Why |
|---|---|---|---|
| `/` | Static | ○ | Marketing content, same for everyone. |
| `/menu` | Dynamic | ƒ | Reads `searchParams` for `?page=`. |
| `/menu/[id]` | SSG | ● | `generateStaticParams` prerenders each dish. |
| `/cart` | Static shell | ○ | Frame is same; lines render client-side. |
| `/checkout` | Dynamic | ƒ | Reads cookies via `getSession()`. |
| `/orders` | Dynamic | ƒ | Per-user query scoped to session. |
| `/orders/[id]` | Dynamic | ƒ | Ownership check needs the session. |
| `/kitchen` | Dynamic | ƒ | Role check reads the session. |
| `/signin` | Static | ○ | Reads `searchParams.next` server-side. |
| `/not-found` | Static | ○ | Same 404 HTML for everyone. |
| `/api/dishes` | Dynamic | ƒ | Reads URL search params. |
| `/api/dishes/[id]` | Dynamic | ƒ | Reads URL segment. |
| `/api/orders` | Dynamic | ƒ | Reads cookies and body. |
| `/api/orders/[id]` | Dynamic | ƒ | Reads cookies and segment. |
| `/robots.txt` | Static | ○ | Generated once at build. |
| `/sitemap.xml` | Static | ○ | Generated once at build. |
| `/opengraph-image` | Static | ○ | Generated once at build. |
| `/menu/[id]/opengraph-image` | SSG | ● | One image per dish. |

**Marker legend:** ○ Static · ● Prerendered from params · ƒ Dynamic

**Middleware matcher:** `["/checkout", "/orders", "/orders/:path*"]` — narrow by design. `/signin`, `/kitchen`, and `/api/*` are excluded (they handle their own checks, or a redirect loop would occur).

Every marker in the build output matches this table. Any disagreement is a bug or a decision not yet thought through.