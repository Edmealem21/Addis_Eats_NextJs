// src/lib/site.js
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ??
  "http://localhost:3000";

export const SITE_NAME = "Addis Eats";

export const SITE_DESCRIPTION =
  "Authentic Ethiopian food, delivered hot from Bole, Addis Ababa. Injera, tibs, shiro and more — order online in minutes.";

// The hostname without protocol — used for display inside OG images.
// e.g. "addis-eats-next-js.vercel.app"
export const SITE_HOST = SITE_URL.replace(/^https?:\/\//, "").replace(/\/$/, "");