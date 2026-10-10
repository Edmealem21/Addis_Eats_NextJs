// src/app/cart/page.js
import CartLines from "@/components/CartLines";

export const metadata = {
  title: "Cart",
  description: "Your Addis Eats cart.",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Your Cart</h1>
      <CartLines />
    </section>
  );
}