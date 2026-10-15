# Addis Eats

A full-stack Ethiopian food-ordering app built on the Next.js App Router.

**Live:** https://addis-eats-next-js.vercel.app

## What it does

Customers browse the menu, add dishes to a cart, place a validated order,
and track their delivery live on a map. Staff manage the catalog, orders,
and users from an admin panel.

## Features

- Menu with search, category filter, and paging
- Favorites (persisted in the browser)
- Cart with quantity controls
- Checkout validated by a shared zod schema
- Order history with live status updates (SSE)
- Delivery tracking map with a moving courier
- CSV export of order history
- Admin panel: dishes, orders, users
- Staff-only routes protected by session + role checks
- HMAC-signed httpOnly session cookies
- Self-hosted fonts, `next/image`, `next/script`
- Full metadata, JSON-LD, sitemap, robots, OG images
- Keyboard navigation: skip link, focus rings, arrow keys, help panel

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS 4 |
| Data | SWR, Zod |
| Backend | Route Handlers + Server Actions |
| Auth | HMAC-signed httpOnly cookies |
| Maps | Leaflet + react-leaflet |
| Images | `next/image` with AVIF/WebP |

## Run locally

```bash
git clone https://github.com/IBT-Qiyas-Full-Stack-Academy/sq6-edmealem-getnet
cd <your-repo>
cp .env.example .env.local
# Edit .env.local:
#   SESSION_SECRET=... (any long random string)
#     generate: node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
#   NEXT_PUBLIC_SITE_URL=http://localhost:3000
npm install
npm run dev