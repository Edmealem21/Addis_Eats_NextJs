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
  <section className="mx-auto max-w-xl space-y-6">
    <header className="space-y-1 text-center">
      <p className="text-xs uppercase tracking-wide text-stone-500">Staff</p>
      <h1 className="text-2xl font-bold">Kitchen</h1>
      <p className="text-stone-600">
        Signed in as <strong>{session.userId}</strong> (role: {session.role})
      </p>
    </header>

    {orders.length === 0 ? (
      <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center">
        <p className="text-stone-700">No orders in the queue.</p>
        <p className="mt-1 text-sm text-stone-500">
          New orders will appear here as customers place them.
        </p>
      </div>
    ) : (
      <ul className="space-y-3">
        {orders.map((o) => (
          <li
            key={o.id}
            className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="truncate font-mono text-sm text-stone-900">
                {o.id}
              </span>
              <span className="shrink-0 text-sm font-semibold text-amber-700">
                {o.total} ETB
              </span>
            </div>
            <p className="mt-1 truncate text-xs text-stone-500">
              {o.name} · {o.address}
            </p>
            <p className="mt-1 text-xs">
              <span
                className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${
                  o.status === "pending"
                    ? "bg-amber-100 text-amber-800"
                    : o.status === "preparing"
                      ? "bg-blue-100 text-blue-800"
                      : o.status === "delivering" || o.status === "out_for_delivery"
                        ? "bg-violet-100 text-violet-800"
                        : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {o.status}
              </span>
            </p>
          </li>
        ))}
      </ul>
    )}
  </section>
);
}