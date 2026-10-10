// src/app/orders/page.js
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { listOrdersForUser } from "@/lib/orders";

export const metadata = {
  title: "My Orders",
  robots: { index: false, follow: false },
};

export default async function OrdersPage() {
  const session = await getSession();
  if (!session) redirect("/signin?next=/orders");

  const orders = listOrdersForUser(session.userId);

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-stone-600">You don&apos;t have any orders yet.</p>
      ) : (
        <ul className="divide-y rounded border bg-white">
          {orders.map((o) => (
            <li key={o.id} className="flex items-center justify-between p-4">
              <div>
                <Link href={`/orders/${o.id}`} className="font-mono text-sm hover:text-amber-700">
                  {o.id}
                </Link>
                <p className="text-xs text-stone-500">
                  {new Date(o.createdAt).toLocaleString()}
                </p>
              </div>
              <span className="text-sm font-medium">{o.total} ETB</span>
            </li>
          ))}
        </ul>
      )}

      <Link href="/menu" className="text-amber-700 underline">← Back to menu</Link>
    </section>
  );
}