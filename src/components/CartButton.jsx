// src/components/CartButton.jsx
"use client";
import Link from "next/link";
import { useCartState } from "./CartContext";

export default function CartButton() {
  const { items } = useCartState();
  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  return <Link href="/cart" className="hover:text-amber-700">Cart ({count})</Link>;
}