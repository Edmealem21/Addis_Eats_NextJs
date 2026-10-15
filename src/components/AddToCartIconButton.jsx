// src/components/AddToCartIconButton.jsx
"use client";

import { useCartActions } from "./CartContext";

export default function AddToCartIconButton({ dish }) {
  const { addItem } = useCartActions();

  function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    addItem(dish);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Add ${dish.name} to cart`}
      className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      Add to cart
    </button>
  );
}