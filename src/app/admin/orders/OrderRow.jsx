// src/app/admin/orders/OrderRow.jsx
"use client";
import Link from "next/link";
import { useTransition } from "react";
import { updateOrderStatusAction, deleteOrderAction } from "../actions";
import { etb } from "@/lib/format";

const STATUSES = ["pending", "preparing", "delivering", "delivered"];

export default function OrderRow({ order }) {
  const [pending, startTransition] = useTransition();

  function handleStatus(e) {
    const status = e.target.value;
    const fd = new FormData();
    fd.set("orderId", order.id);
    fd.set("status", status);
    startTransition(() => updateOrderStatusAction(fd));
  }

  function handleDelete() {
    if (!confirm(`Delete order ${order.id}?`)) return;
    const fd = new FormData();
    fd.set("orderId", order.id);
    startTransition(() => deleteOrderAction(fd));
  }

  return (
    <tr className="border-b border-stone-100 last:border-b-0 hover:bg-stone-50/50">
      <td className="px-4 py-3 font-mono text-xs text-stone-700">{order.id}</td>
      <td className="px-4 py-3 text-stone-700">
        {order.email ?? order.name ?? "—"}
      </td>
      <td className="px-4 py-3 text-stone-600">{order.neighbourhood ?? "—"}</td>
      <td className="px-4 py-3 text-right tabular-nums text-stone-700">
        {etb(order.total)}
      </td>
      <td className="px-4 py-3">
        <select
          value={order.status}
          onChange={handleStatus}
          disabled={pending}
          aria-label={`Status of order ${order.id}`}
          className="min-h-[36px] rounded-lg border border-stone-300 bg-white px-3 py-1 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A0522D]"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </td>
      <td className="px-4 py-3">
        <div className="flex justify-end gap-1">
          <Link
            href={`/orders/${order.id}`}
            aria-label={`View order ${order.id}`}
            className="grid h-9 w-9 place-items-center rounded-lg hover:bg-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A0522D]"
          >
            👁️
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={pending}
            aria-label={`Delete order ${order.id}`}
            className="grid h-9 w-9 place-items-center rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            🗑️
          </button>
        </div>
      </td>
    </tr>
  );
}