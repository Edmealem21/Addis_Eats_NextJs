# Addis Eats

A full-stack Ethiopian food-ordering app on the Next.js App Router.

**Live:** https://addis-eats.vercel.app

## Features

- Menu with search, category filter, paging
- Cart with shared context across routes
- Checkout via validated Server Action
- Order tracking with live polling (SWR)
- HMAC-signed httpOnly session cookies
- Middleware + page + action protection
- Staff-only `/kitchen`
- Self-hosted fonts, `next/image`, `next/script`
- Full metadata, JSON-LD, sitemap, robots

## Run locally

    git clone https://github.com/<you>/addis-eats
    cd addis-eats
    cp .env.example .env.local
    npm install
    npm run dev

Open http://localhost:3000

## Demo accounts

| Email | Password | Role |
|---|---|---|
| almaz@example.com | password1 | Customer |
| kebede@example.com | password2 | Customer |
| chef@addiseats.com | kitchen1 | Staff |

## Documentation

- `AUTH.md` — layers, attacks, and what each layer proves
- `DATA.md` — every query, key, refresh rule
- `PERF.md` — Lighthouse before/after with causes
- `SEO.md` — metadata hierarchy, JSON-LD, sitemap
- `STRATEGY.md` — rendering strategy per route
- `BOUNDARY.md` — server/client placement