// src/app/api/dishes/route.js
import { getActiveDishes } from "@/lib/dishes";

const PAGE_SIZE = 8;

export async function GET(req) {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").trim().toLowerCase();
  const category = (url.searchParams.get("category") ?? "").trim();
  const page = Math.max(1, Number(url.searchParams.get("page") ?? 1));

    let all = await getActiveDishes();

  // Filter by category (exact match, case-insensitive).
  if (category && category.toLowerCase() !== "all") {
    all = all.filter(
      (d) => d.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Filter by search term.
  if (q) {
    all = all.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q)
    );
  }

  const total = all.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;

  return Response.json(
    {
      dishes: all.slice(start, start + PAGE_SIZE),
      total,
      page: safePage,
      pageSize: PAGE_SIZE,
      totalPages,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    }
  );
}