"use client";
import { useEffect, useState } from "react";
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

  // Only render the timestamp after hydration — avoids a server/client mismatch
  // because the server has no reliable "now" for the user's timezone.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

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
      {/* ...steps and totals... */}

      <p className="h-4 text-xs text-stone-400" aria-live="polite">
        {!mounted
          ? ""
          : isValidating
            ? "Refreshing…"
            : `Updated ${new Date().toLocaleTimeString()}`}
      </p>
    </div>
  );
}