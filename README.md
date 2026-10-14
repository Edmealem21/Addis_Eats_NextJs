# Addis Eats

A full-stack Ethiopian food-ordering app built on the Next.js App Router.

**Live:** https://addis-eats-next-js.vercel.app

## What it does

- Browse the menu — search, filter, and page through dishes
- Add dishes to a cart, place an order with a validated form
- Track an order in real time on a map with live status updates
- Staff dashboard with revenue and order charts
- CSV export of order history

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS 4 |
| Data | SWR, Zod |
| Backend | Route Handlers + Server Actions |
| Auth | HMAC-signed httpOnly cookies |
| Maps | Leaflet, react-leaflet |
| Images | `next/image` with AVIF/WebP |

## Run locally

```bash
# 1. Clone
git clone https://github.com/IBT-Qiyas-Full-Stack-Academy/sq6-edmealem-getnet
cd <repo>

# 2. Copy env and edit
cp .env.example .env.local
#   SESSION_SECRET: any long random string
#     generate: node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
#   NEXT_PUBLIC_SITE_URL: http://localhost:3000

# 3. Install and run
npm install
npm run dev