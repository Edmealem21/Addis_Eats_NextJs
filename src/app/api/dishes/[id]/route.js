// src/app/api/dishes/[id]/route.js
import { getDish } from "@/lib/dishes";

export async function GET(_req, { params }) {
  const { id } = await params;
  const dish = await getDish(id);

  if (!dish) {
    return Response.json({ error: `Dish '${id}' not found` }, { status: 404 });
  }

  return Response.json(
    { dish },
    {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}