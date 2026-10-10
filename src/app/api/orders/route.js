// src/app/api/orders/route.js
import { orderSchema } from "@/lib/schema";
import { addOrder, newOrderId } from "@/lib/orders";
import { getSession } from "@/lib/session";

export async function POST(req) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  let body;
  try { body = await req.json(); }
  catch { return Response.json({ error: "Invalid JSON body" }, { status: 400 }); }

  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const total = parsed.data.items.reduce((sum, i) => sum + i.quantity * 100, 0);

  const order = addOrder({
    id: newOrderId(),
    userId: session.userId,
    createdAt: new Date().toISOString(),
    status: "pending",
    total,
    ...parsed.data,
  });

  return Response.json({ order }, { status: 201 });
}