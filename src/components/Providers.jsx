// src/components/Providers.jsx
"use client";

import { useMemo, useState } from "react";
import { CartStateContext, CartActionsContext } from "./CartContext";

export default function Providers({ children }) {
  const [items, setItems] = useState([]);

  const actions = useMemo(
    () => ({
      addItem(dish) {
        setItems((prev) => {
          const existing = prev.find((i) => i.id === dish.id);
          if (existing) {
            return prev.map((i) =>
              i.id === dish.id ? { ...i, quantity: i.quantity + 1 } : i
            );
          }
          return [
            ...prev,
            {
              id: dish.id,
              name: dish.name,
              price: dish.price,
              image: dish.image,
              quantity: 1,
            },
          ];
        });
      },

      // Increment quantity. Adds 1 if the item exists.
      increment(id) {
        setItems((prev) =>
          prev.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity + 1 } : i
          )
        );
      },

      // Decrement quantity. Removes the item when it would hit 0.
      decrement(id) {
        setItems((prev) => {
          const existing = prev.find((i) => i.id === id);
          if (!existing) return prev;
          if (existing.quantity <= 1) {
            return prev.filter((i) => i.id !== id);
          }
          return prev.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity - 1 } : i
          );
        });
      },

      removeItem(id) {
        setItems((prev) => prev.filter((i) => i.id !== id));
      },

      clear() {
        setItems([]);
      },
    }),
    []
  );

  const state = useMemo(() => ({ items }), [items]);

  return (
    <CartActionsContext.Provider value={actions}>
      <CartStateContext.Provider value={state}>
        {children}
      </CartStateContext.Provider>
    </CartActionsContext.Provider>
  );
}