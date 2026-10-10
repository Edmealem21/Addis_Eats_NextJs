// src/components/CartLines.jsx
"use client";
import Link from "next/link";
import { useCartState, useCartActions } from "./CartContext";

export default function CartLines() {
  const { items } = useCartState();
  const { removeItem, clear } = useCartActions();

  if (items.length === 0) {
    return (
      <div className="space-y-4">
        <p className="text-stone-600">Your cart is empty.</p>
        <Link href="/menu" className="text-amber-700 underline">← Back to menu</Link>
      </div>
    );
  }

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="space-y-6">
      <ul className="divide-y rounded-lg border bg-white">
        {items.map((i) => (
          <li key={i.id} className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium">{i.name}</p>
              <p className="text-sm text-stone-500">{i.quantity} × {i.price} ETB</p>
            </div>
            <button onClick={() => removeItem(i.id)} className="text-sm text-red-600 hover:underline">
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Total: {total} ETB</p>
        <div className="flex gap-3">
          <button onClick={clear} className="rounded border px-3 py-1 text-sm">Clear</button>
          <Link href="/checkout" className="rounded bg-amber-600 px-4 py-2 text-white">
            Checkout →
          </Link>
        </div>
      </div>
    </div>
  );
}