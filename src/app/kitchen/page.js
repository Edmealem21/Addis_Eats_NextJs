// src/app/kitchen/page.js
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { listAllOrders } from "@/lib/orders";

export const metadata = {
  title: "Kitchen",
  robots: { index: false, follow: false },
};

export default async function KitchenPage() {
  const session = await getSession();
  if (!session) redirect("/signin?next=/kitchen");
  if (session.role !== "staff") redirect("/");

  const orders = listAllOrders();

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-wide text-stone-500">Staff</p>
        <h1 className="text-2xl font-bold">Kitchen</h1>
        <p className="text-stone-600">
          Signed in as <strong>{session.userId}</strong> (role: {session.role})
        </p>
      </header>

      {orders.length === 0 ? (
        <p className="text-stone-600">No orders in the queue.</p>
      ) : (
        <ul className="divide-y rounded border bg-white">
          {orders.map((o) => (
            <li key={o.id} className="p-4">
              <div className="flex justify-between">
                <span className="font-mono text-sm">{o.id}</span>
                <span className="text-sm font-medium">{o.total} ETB</span>
              </div>
              <p className="text-xs text-stone-500">{o.name} · {o.address}</p>
              <p className="text-xs text-stone-500">Status: {o.status}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}