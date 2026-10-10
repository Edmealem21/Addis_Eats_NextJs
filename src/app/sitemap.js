// src/app/sitemap.js
import { dishes } from "@/lib/dishes";
import { SITE_URL } from "@/lib/site";

export default async function sitemap() {
  const now = new Date();

  const staticRoutes = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/menu`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
  ];

  const dishRoutes = dishes.map((dish) => ({
    url: `${SITE_URL}/menu/${dish.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...dishRoutes];
}