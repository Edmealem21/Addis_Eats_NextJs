// src/components/CartLines.jsx
"use client";

import Link from "next/link";
import { useCartState, useCartActions } from "./CartContext";

export default function CartLines() {
  const { items } = useCartState();
  const { increment, decrement, removeItem, clear } = useCartActions();

  // ── Empty state ─────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-sm rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm">
        <p className="text-lg font-medium text-stone-700">Your cart is empty</p>
        <p className="mt-1 text-sm text-stone-500">
          Add a dish from the menu to get started.
        </p>
        <Link
          href="/menu"
          className="mt-6 inline-block min-h-[44px] rounded-lg bg-amber-600 px-5 py-2.5 font-medium text-white hover:bg-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
        >
          Browse menu
        </Link>
      </div>
    );
  }

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // ── Cart with items ─────────────────────────────────────────
  return (
    <div className="mx-auto max-w-sm space-y-3">
      {/* Items */}
      {items.map((item) => (
        <div
          key={item.id}
          className="rounded-2xl border border-stone-200 bg-white p-3 shadow-sm"
        >
          <div className="flex items-center gap-3">
            {/* Image */}
            {item.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.image}
                alt={item.name}
                width={56}
                height={56}
                className="h-14 w-14 shrink-0 rounded-xl object-cover"
              />
            )}

            {/* Name + price */}
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-stone-900">
                {item.name}
              </p>
              <p className="text-sm font-medium text-amber-700">
                {item.price} ETB
              </p>
            </div>

            {/* Line total */}
            <div className="shrink-0 text-right">
              <p className="text-sm font-semibold text-stone-900 tabular-nums">
                {item.price * item.quantity} ETB
              </p>
            </div>
          </div>

          {/* Bottom row: quantity + remove */}
          <div className="mt-3 flex items-center justify-between">
            {/* Quantity pill — plain − and + characters */}
            <div className="inline-flex items-center rounded-full border border-stone-300 bg-white">
              <button
                type="button"
                onClick={() => decrement(item.id)}
                aria-label={`Decrease quantity of ${item.name}`}
                className="grid h-8 w-8 place-items-center rounded-full text-lg font-bold text-stone-800 hover:bg-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                −
              </button>
              <span
                className="min-w-[28px] text-center text-sm font-semibold text-stone-900 tabular-nums"
                aria-live="polite"
              >
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={() => increment(item.id)}
                aria-label={`Increase quantity of ${item.name}`}
                className="grid h-8 w-8 place-items-center rounded-full text-lg font-bold text-stone-800 hover:bg-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="text-sm text-red-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      {/* Total row */}
      <div className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white px-4 py-3 shadow-sm">
        <span className="font-semibold text-stone-900">Total</span>
        <span className="text-lg font-bold text-amber-700 tabular-nums">
          {total} ETB
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={clear}
          className="min-h-[44px] rounded-lg border border-stone-300 px-4 py-2 text-sm hover:bg-stone-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          Clear
        </button>
        <Link
          href="/checkout"
          className="flex-1 rounded-lg bg-amber-600 py-3 text-center font-semibold text-white hover:bg-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
        >
          Checkout →
        </Link>
      </div>
    </div>
  );
}