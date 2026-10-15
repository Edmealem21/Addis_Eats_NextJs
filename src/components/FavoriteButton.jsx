// src/components/FavoriteButton.jsx
"use client";

import { useFavorites } from "./FavoritesContext";

export default function FavoriteButton({ dishId, dishName }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(dishId);

  function handleClick(e) {
    // Stop the click from bubbling to any parent link.
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(dishId);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={active ? `Remove ${dishName} from favorites` : `Add ${dishName} to favorites`}
      aria-pressed={active}
      className={`grid h-9 w-9 place-items-center rounded-full border shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 ${
        active
          ? "border-red-300 bg-red-50 text-red-600"
          : "border-stone-200 bg-white text-stone-400 hover:text-red-500 hover:border-red-200"
      }`}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}