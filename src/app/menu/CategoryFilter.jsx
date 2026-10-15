// src/app/menu/CategoryFilter.jsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Order matters — this is the display order in the row.
const CATEGORIES = [
  { value: "All", label: "All" },
  { value: "Ethiopian", label: "Ethiopian" },
  { value: "Burgers", label: "Burgers" },
  { value: "Drinks", label: "Drinks" },
];

export default function CategoryFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const current = searchParams.get("category") ?? "All";

  function setCategory(value) {
    const sp = new URLSearchParams(searchParams);

    if (value === "All") {
      sp.delete("category");
    } else {
      sp.set("category", value);
    }

    // Reset to page 1 whenever the category changes.
    sp.delete("page");

    const qs = sp.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <div
      role="group"
      aria-label="Filter dishes by category"
      className="flex flex-wrap gap-2"
    >
      {CATEGORIES.map((c) => {
        const active = current.toLowerCase() === c.value.toLowerCase();
        return (
          <button
            key={c.value}
            type="button"
            onClick={() => setCategory(c.value)}
            aria-pressed={active}
            className={`min-h-[40px] rounded-full px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 ${
              active
                ? "bg-amber-600 text-white shadow-sm"
                : "border border-stone-300 bg-white text-stone-700 hover:bg-amber-50 hover:border-amber-400"
            }`}
          >
            {c.label}
          </button>
        );
      })}
    </div>
  );
}