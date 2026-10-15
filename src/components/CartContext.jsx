// src/components/CartContext.jsx
"use client";

import { createContext, useContext } from "react";

export const CartStateContext = createContext(null);
export const CartActionsContext = createContext(null);

export function useCartState() {
  const ctx = useContext(CartStateContext);
  if (!ctx) throw new Error("useCartState must be used inside <Providers>");
  return ctx;
}

export function useCartActions() {
  const ctx = useContext(CartActionsContext);
  if (!ctx) throw new Error("useCartActions must be used inside <Providers>");
  return ctx;
}

export function useCart() {
  return { ...useCartState(), ...useCartActions() };
}