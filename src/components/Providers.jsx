// src/components/Providers.jsx
"use client";
import { useMemo, useState } from "react";
import { CartStateContext, CartActionsContext } from "./CartContext";

export default function Providers({ children }) {
  const [items, setItems] = useState([]);

  const actions = useMemo(() => ({
    addItem(dish) {
      setItems((prev) => {
        const existing = prev.find((i) => i.id === dish.id);
        if (existing) {
          return prev.map((i) =>
            i.id === dish.id ? { ...i, quantity: i.quantity + 1 } : i
          );
        }
        return [...prev, { id: dish.id, name: dish.name, price: dish.price, quantity: 1 }];
      });
    },
    removeItem(id) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    },
    clear() { setItems([]); },
  }), []);

  const state = useMemo(() => ({ items }), [items]);

  return (
    <CartActionsContext.Provider value={actions}>
      <CartStateContext.Provider value={state}>
        {children}
      </CartStateContext.Provider>
    </CartActionsContext.Provider>
  );
}