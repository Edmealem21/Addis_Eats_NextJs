// src/app/menu/MenuBrowser.jsx
"use client";
import { useState } from "react";
import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import fetcher from "@/lib/fetcher";
import SearchBox from "./SearchBox";
import DishList from "./DishList";
import Pager from "./Pager";

export default function MenuBrowser({ fallbackData, page }) {
  const searchParams = useSearchParams();
  const activePage = Number(searchParams.get("page") ?? page ?? 1);
  const [term, setTerm] = useState("");

  const searchKey = term
    ? `/api/dishes?q=${encodeURIComponent(term)}&page=${activePage}`
    : null;

  const { data: searchData, isValidating: searchValidating } = useSWR(
    searchKey, fetcher, { keepPreviousData: true }
  );

  const listKey = `/api/dishes?page=${activePage}`;
  const { data: listData, error, isValidating: listValidating } = useSWR(
    listKey, fetcher, {
      fallbackData: activePage === Number(page) ? fallbackData : undefined,
      keepPreviousData: true,
      revalidateOnFocus: false,
      dedupingInterval: 2000,
    }
  );

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
      <SearchBox onDebouncedChange={setTerm} />
      <DishList dishes={dishes} />
      <Pager page={activePage} totalPages={totalPages} />
      <p className="h-4 text-xs text-stone-400" aria-live="polite">
        {validating ? "Refreshing…" : ""}
      </p>
    </div>
  );
}