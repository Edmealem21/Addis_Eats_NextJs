// src/app/api/orders/[id]/route.js
import { getOrder } from "@/lib/orders";
import { getSession } from "@/lib/session";

const STATUS_FLOW = ["pending", "preparing", "out_for_delivery", "delivered"];

export async function GET(_req, { params }) {
  const { id } = await params;

  const session = await getSession();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const order = getOrder(id);
  if (!order) return Response.json({ error: `Order '${id}' not found` }, { status: 404 });
  if (order.userId !== session.userId) {
    return Response.json({ error: `Order '${id}' not found` }, { status: 404 });
  }

  const ageSeconds = (Date.now() - new Date(order.createdAt).getTime()) / 1000;
  const step = Math.min(STATUS_FLOW.length - 1, Math.floor(ageSeconds / 10));

  return Response.json(
    { order: { ...order, status: STATUS_FLOW[step] } },
    { headers: { "Cache-Control": "private, no-store" } }
  );
}