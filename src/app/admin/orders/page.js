// src/app/admin/orders/page.js
import { listAllOrders } from "@/lib/orders";
import OrderRow from "./OrderRow";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = (await listAllOrders()).sort((a, b) =>
    a.createdAt < b.createdAt ? 1 : -1
  );

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-stone-900">Orders Management</h1>
      </header>

      <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">All orders</caption>
          <thead className="border-b border-stone-200 bg-stone-50">
            <tr>
              <Th>Order</Th>
              <Th>Customer</Th>
              <Th>Area</Th>
              <Th align="right">Total</Th>
              <Th>Status</Th>
              <Th align="right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-10 text-center text-sm text-stone-500">
                  No orders yet.
                </td>
              </tr>
            ) : (
              orders.map((o) => <OrderRow key={o.id} order={o} />)
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children, align = "left" }) {
  return (
    <th scope="col" className={`px-4 py-3 text-xs font-medium uppercase tracking-wide text-stone-500 ${align === "right" ? "text-right" : ""}`}>
      {children}
    </th>
  );
}