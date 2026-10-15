// src/components/FavoritesLink.jsx
"use client";

import Link from "next/link";
import { useFavorites } from "./FavoritesContext";

export default function FavoritesLink() {
  const { ids, loaded } = useFavorites();
  const count = loaded ? ids.length : 0;

  return (
    <Link
      href="/favorites"
      className="flex items-center gap-1 hover:text-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      <span>Favorites{count > 0 ? ` (${count})` : ""}</span>
    </Link>
  );
}