// src/app/cart/page.js
import CartLines from "@/components/CartLines";

export const metadata = {
  title: "Your Cart",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <section className="space-y-6">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-stone-900">Your Cart</h1>
      </header>
      <CartLines />
    </section>
  );
}