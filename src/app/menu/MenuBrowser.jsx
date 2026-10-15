// src/app/menu/MenuBrowser.jsx
"use client";

import { useState } from "react";
import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import fetcher from "@/lib/fetcher";
import CategoryFilter from "./CategoryFilter";
import SearchBox from "./SearchBox";
import DishList from "./DishList";
import Pager from "./Pager";

export default function MenuBrowser({ fallbackData, page }) {
  const searchParams = useSearchParams();
  const activePage = Number(searchParams.get("page") ?? page ?? 1);
  const activeCategory = searchParams.get("category") ?? "All";
  const [term, setTerm] = useState("");

  // Build the query string. Category always goes in; q only when there's a term.
  const params = new URLSearchParams();
  params.set("page", String(activePage));
  if (activeCategory && activeCategory.toLowerCase() !== "all") {
    params.set("category", activeCategory);
  }

  // ── Search hook ─────────────────────────────────────────────
  const searchKey = term
    ? `/api/dishes?${params.toString()}&q=${encodeURIComponent(term)}`
    : null;

  const { data: searchData, isValidating: searchValidating } = useSWR(
    searchKey,
    fetcher,
    { keepPreviousData: true }
  );

  // ── List hook (with category + page) ────────────────────────
  const listKey = `/api/dishes?${params.toString()}`;
  const {
    data: listData,
    error,
    isValidating: listValidating,
  } = useSWR(listKey, fetcher, {
    fallbackData:
      activePage === Number(page) &&
      activeCategory.toLowerCase() === "all"
        ? fallbackData
        : undefined,
    keepPreviousData: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 2000,
  });

  const activeData = term ? searchData ?? listData : listData;
  const validating = searchValidating || listValidating;

  if (error) {
    return (
      <div className="rounded border border-red-300 bg-red-50 p-4 text-red-700">
        Couldn&apos;t load the menu.
      </div>
    );
  }

  const dishes = activeData?.dishes ?? [];
  const totalPages = activeData?.totalPages ?? 1;

    return (
      <div className="space-y-6">
        {/* Centered header block: filter, search, count */}
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4">
          <CategoryFilter />

          <div className="w-full max-w-sm">
            <SearchBox onDebouncedChange={setTerm} onImmediateChange={setTerm} />
          </div>

          <p className="text-xs text-stone-500 text-center">
            {activeData?.total ?? 0} dish
            {(activeData?.total ?? 0) === 1 ? "" : "es"}
            {activeCategory.toLowerCase() !== "all"
              ? ` in "${activeCategory}"`
              : ""}
            {term ? ` matching "${term}"` : ""}
          </p>
        </div>

        {/* Dish grid — stays full width so 4 columns fit */}
        <DishList dishes={dishes} />

        {/* Pager */}
        <Pager page={activePage} totalPages={totalPages} />

        <p className="h-4 text-xs text-stone-400 text-center" aria-live="polite">
          {validating ? "Refreshing…" : ""}
        </p>
      </div>
    );
}