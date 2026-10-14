// src/components/ExportButton.jsx
"use client";
import { useState } from "react";

export default function ExportButton() {
  const [busy, setBusy] = useState(false);

  async function handleClick() {
    setBusy(true);
    try {
      const res = await fetch("/api/orders/export");
      if (!res.ok) throw new Error(`Export failed (${res.status})`);
      const csv = await res.text();

      // Trigger the download in-browser.
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `addis-eats-orders-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
<button
  type="button"
  onClick={handleClick}
  disabled={busy}
  className="min-h-[44px] rounded bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:opacity-50"
>
  {busy ? "Exporting…" : "Export CSV"}
</button>
  );
}