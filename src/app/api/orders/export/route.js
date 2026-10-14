// src/app/api/orders/export/route.js
import { getSession } from "@/lib/session";
import { listOrdersForUser } from "@/lib/orders";
import { toCsv } from "@/lib/csv";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const orders = await listOrdersForUser(session.userId);

  const rows = orders.map((o) => ({
    id: o.id,
    date: o.createdAt,
    customer: o.name,
    neighbourhood: o.neighbourhood ?? "",
    address: o.address,
    status: o.status,
    total_etb: o.total,
    items: o.items.map((i) => `${i.name} × ${i.quantity}`).join(" | "),
  }));

  const csv = toCsv(rows, [
    "id",
    "date",
    "customer",
    "neighbourhood",
    "address",
    "status",
    "total_etb",
    "items",
  ]);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="addis-eats-orders-${Date.now()}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}