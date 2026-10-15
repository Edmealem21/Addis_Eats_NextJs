// src/app/favorites/FavoritesList.jsx
"use client";

import Link from "next/link";
import { useFavorites } from "@/components/FavoritesContext";
import DishCard from "@/components/DishCard";

export default function FavoritesList({ dishes }) {
  const { ids, loaded, clearFavorites } = useFavorites();

  if (!loaded) {
    return <p className="text-sm text-stone-500">Loading…</p>;
  }

  const favorites = dishes.filter((d) => ids.includes(d.id));

  // ── Empty state ─────────────────────────────────────────────
  if (favorites.length === 0) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-10 text-center">
        <p className="text-lg font-medium text-stone-700">
          You haven&apos;t saved any dishes yet.
        </p>
        <p className="mt-1 text-sm text-stone-500">
          Tap the ❤ icon on any dish to add it here.
        </p>
        <Link
          href="/menu"
          className="mt-6 inline-block min-h-[44px] rounded-lg bg-amber-600 px-5 py-2.5 font-medium text-white hover:bg-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
        >
          Browse the menu
        </Link>
      </div>
    );
  }

  // ── List of favorites using the same DishCard as /menu ──────
  return (
    <div className="space-y-6">
      {/* Count + Clear all */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-stone-500">
          {favorites.length} dish{favorites.length === 1 ? "" : "es"}
        </p>
        <button
          type="button"
          onClick={clearFavorites}
          className="min-h-[36px] rounded border border-stone-300 px-3 py-1 text-sm hover:bg-stone-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          Clear all
        </button>
      </div>

      {/* Same grid and card as the menu page */}
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {favorites.map((dish, index) => (
          <DishCard key={dish.id} dish={dish} priority={index < 4} />
        ))}
      </ul>
    </div>
  );
}