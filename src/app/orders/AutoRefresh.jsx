// src/app/orders/AutoRefresh.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AutoRefresh({ intervalMs = 15000 }) {
  const router = useRouter();
  const [lastRefresh, setLastRefresh] = useState(null);

  useEffect(() => {
    const id = setInterval(() => {
      // Only refresh while the tab is visible.
      if (document.visibilityState === "visible") {
        router.refresh();
        setLastRefresh(Date.now());
      }
    }, intervalMs);
    return () => clearInterval(id);
  }, [router, intervalMs]);

  // Refresh immediately when the user comes back to this tab.
  useEffect(() => {
    function handleVisible() {
      if (document.visibilityState === "visible") {
        router.refresh();
        setLastRefresh(Date.now());
      }
    }
    document.addEventListener("visibilitychange", handleVisible);
    return () => document.removeEventListener("visibilitychange", handleVisible);
  }, [router]);

  return (
    <p className="text-xs text-stone-400" aria-live="polite">
      {lastRefresh
        ? `Auto-refreshed · ${new Date(lastRefresh).toLocaleTimeString()}`
        : "Live"}
    </p>
  );
}