// src/components/FavoritesProvider.jsx
"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { FavoritesContext } from "./FavoritesContext";

const STORAGE_KEY = "addis-favorites";

export default function FavoritesProvider({ children }) {
  const [ids, setIds] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage after mount (avoids SSR mismatch).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setIds(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  // Save on every change.
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {}
  }, [ids, loaded]);

  const isFavorite = useCallback((id) => ids.includes(id), [ids]);

  const toggleFavorite = useCallback((id) => {
    setIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const clearFavorites = useCallback(() => setIds([]), []);

  const value = useMemo(
    () => ({ ids, isFavorite, toggleFavorite, clearFavorites, loaded }),
    [ids, isFavorite, toggleFavorite, clearFavorites, loaded]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}