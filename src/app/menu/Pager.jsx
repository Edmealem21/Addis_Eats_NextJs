// src/app/menu/Pager.jsx
"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Pager({ page, totalPages }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function goto(n) {
    const sp = new URLSearchParams(searchParams);
    sp.set("page", String(n));
    router.push(`${pathname}?${sp.toString()}`);
  }

  if (totalPages <= 1) return null;

  return (
    <nav className="flex items-center justify-between pt-2">
      <button onClick={() => goto(page - 1)} disabled={page <= 1}
        className="rounded border px-3 py-1 text-sm disabled:opacity-40">← Prev</button>
      <span className="text-sm text-stone-600">Page {page} of {totalPages}</span>
      <button onClick={() => goto(page + 1)} disabled={page >= totalPages}
        className="rounded border px-3 py-1 text-sm disabled:opacity-40">Next →</button>
    </nav>
  );
}