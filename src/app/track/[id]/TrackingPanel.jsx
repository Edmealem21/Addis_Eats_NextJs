// src/app/track/[id]/TrackingPanel.jsx
"use client";

import { useEffect, useState } from "react";
import { relative } from "@/lib/format";

const STATUS_LABELS = {
  pending: "Pending",
  preparing: "Preparing",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
};

export default function TrackingPanel({
  status,
  connection,
  lastEventAt,
  restaurant,
  delivery,
  address,
}) {
  // 1. Use a mounted state to prevent SSR hydration mismatches for time
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);

  const stepIndex = Object.keys(STATUS_LABELS).indexOf(status);

  return (
    <div className="space-y-6">
      {/* Connection indicator */}
      <div className="flex items-center gap-2 text-sm">
        <span
          className={`inline-block h-2.5 w-2.5 rounded-full ${
            connection === "open"
              ? "bg-green-500 animate-pulse"
              : connection === "connecting"
                ? "bg-amber-500"
                : connection === "closed"
                  ? "bg-stone-400"
                  : "bg-red-500"
          }`}
        />
        <span className="text-stone-600">
          {connection === "open"
            ? "Live"
            : connection === "connecting"
              ? "Connecting…"
              : connection === "closed"
                ? "Stream closed"
                : "Connection lost"}
        </span>
        
        {/* 2. Only render time AFTER mount to avoid mismatch */}
        {mounted && lastEventAt && (
          <span className="text-xs text-stone-400">
            · updated {relative(lastEventAt, now)}
          </span>
        )}
      </div>

      {/* Status steps */}
      <ol className="space-y-3">
        {Object.entries(STATUS_LABELS).map(([key, label], i) => {
          const reached = i <= stepIndex;
          return (
            <li key={key} className="flex items-center gap-3">
              <span
                className={`grid h-6 w-6 place-items-center rounded-full text-xs ${
                  reached
                    ? "bg-amber-600 text-white"
                    : "border border-stone-300 bg-white text-stone-400"
                }`}
              >
                {i + 1}
              </span>
              <span className={reached ? "font-medium" : "text-stone-500"}>
                {label}
              </span>
            </li>
          );
        })}
      </ol>

      {/* Text equivalent of map */}
      <div className="space-y-2 rounded-lg border bg-white p-4 text-sm">
        <h3 className="font-semibold">Delivery details</h3>
        <dl className="space-y-1">
          <Row label="Address">{address}</Row>
          <Row label="Restaurant">
            {restaurant[0].toFixed(4)}, {restaurant[1].toFixed(4)}
          </Row>
          <Row label="Destination">
            {delivery[0].toFixed(4)}, {delivery[1].toFixed(4)}
          </Row>
        </dl>
        <p className="text-xs text-stone-500">
          The map shows the courier 🚗 approaching your address as the status updates.
        </p>
      </div>
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex gap-2">
      <dt className="min-w-32 text-stone-500">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}