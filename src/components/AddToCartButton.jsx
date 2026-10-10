// src/components/AddToCartButton.jsx
"use client";
import { useCartActions } from "./CartContext";

export default function AddToCartButton({ dish }) {
  const { addItem } = useCartActions();
  return (
    <button
      onClick={() => addItem(dish)}
      className="rounded bg-amber-600 px-4 py-2 text-white hover:bg-amber-700"
    >
      Add to cart
    </button>
  );
}