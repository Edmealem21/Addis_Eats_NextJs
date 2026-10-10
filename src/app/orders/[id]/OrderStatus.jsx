// src/app/orders/[id]/OrderStatus.jsx
"use client";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";

const STEPS = ["pending", "preparing", "out_for_delivery", "delivered"];
const LABELS = {
  pending: "Pending",
  preparing: "Preparing",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
};

export default function OrderStatus({ id, fallbackData }) {
  const { data, error, isValidating } = useSWR(`/api/orders/${id}`, fetcher, {
    fallbackData,
    refreshInterval: 5000,
    revalidateOnFocus: false,
    revalidateOnMount: !fallbackData,
    keepPreviousData: true,
  });

  if (!data && error) {
    return (
      <div className="rounded border border-red-300 bg-red-50 p-4 text-red-700">
        Couldn&apos;t load order ({error.status ?? "unknown"}).
      </div>
    );
  }

  if (!data) return <div className="text-stone-500">Loading…</div>;

  const order = data.order;
  const currentStep = STEPS.indexOf(order.status ?? "pending");
  const safeStep = currentStep === -1 ? 0 : currentStep;

  return (
    <div className="space-y-6">
      {error && (
        <p className="rounded border border-amber-300 bg-amber-50 p-2 text-xs text-amber-800">
          Showing the last known state — live updates paused.
        </p>
      )}

      <ol className="space-y-3">
        {STEPS.map((step, i) => {
          const reached = i <= safeStep;
          return (
            <li key={step} className="flex items-center gap-3">
              <span className={`grid h-6 w-6 place-items-center rounded-full text-xs ${
                reached ? "bg-amber-600 text-white" : "border border-stone-300 bg-white text-stone-400"
              }`}>{i + 1}</span>
              <span className={reached ? "font-medium" : "text-stone-500"}>{LABELS[step]}</span>
            </li>
          );
        })}
      </ol>

      <dl className="space-y-1 rounded border bg-white p-4">
        <div className="flex justify-between">
          <dt className="text-stone-600">Items</dt>
          <dd>{order.items?.length ?? 0}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-stone-600">Total</dt>
          <dd className="font-medium">{order.total ?? "—"} ETB</dd>
        </div>
      </dl>

      <p className="h-4 text-xs text-stone-400" aria-live="polite">
        {isValidating ? "Refreshing…" : `Updated ${new Date().toLocaleTimeString()}`}
      </p>
    </div>
  );
}