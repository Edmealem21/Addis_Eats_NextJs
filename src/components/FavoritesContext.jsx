// src/components/FavoritesContext.jsx
"use client";

import { createContext, useContext } from "react";

export const FavoritesContext = createContext(null);

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used inside <FavoritesProvider>");
  return ctx;
}