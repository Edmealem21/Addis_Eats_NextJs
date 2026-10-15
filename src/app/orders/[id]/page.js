// src/app/orders/[id]/page.js
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getOrder } from "@/lib/orders";
import OrderStatus from "./OrderStatus";

export const metadata = {
  title: "Order status",
  robots: { index: false, follow: false },
};

export default async function OrderPage({ params }) {
  const { id } = await params;

  const session = await getSession();
  if (!session) redirect(`/signin?next=/orders/${id}`);

  const order = getOrder(id);
  if (!order) notFound();
  if (order.userId !== session.userId) notFound();

return (
  <section className="mx-auto max-w-md space-y-6">
    <header className="space-y-1 text-center">
      <p className="text-xs uppercase tracking-wide text-stone-500">Order</p>
      <h1 className="font-mono text-2xl font-bold">{order.id}</h1>
    </header>

    <OrderStatus id={id} fallbackData={{ order }} />

    <div className="flex justify-center gap-4">
      <Link href="/orders" className="text-amber-700 underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500">
        ← My orders
      </Link>
      <Link href="/menu" className="text-amber-700 underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500">
        Menu
      </Link>
    </div>
  </section>
);
}