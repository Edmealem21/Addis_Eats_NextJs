// src/app/track/[id]/page.js
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getOrder } from "@/lib/orders";
import { coordsFor } from "@/lib/geo";
import { etb, when } from "@/lib/format";
import TrackingView from "./TrackingView";

export const metadata = {
  title: "Track order",
  robots: { index: false, follow: false },
};

export default async function TrackPage({ params }) {
  const { id } = await params;

  // 1. Verify the user is signed in
  const session = await getSession();
  if (!session) redirect(`/signin?next=/track/${id}`);

  // 2. MUST AWAIT THIS! Otherwise it returns a Promise and crashes.
  const order = await getOrder(id); 
  
  // 3. Check if the order exists
  if (!order) notFound();
  
  // 4. Check if the user owns this order
  if (order.userId !== session.userId) notFound();

  const { restaurant, delivery } = coordsFor(order.neighbourhood);

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <header className="space-y-1 text-center">
        <p className="text-xs uppercase tracking-wide text-stone-500">
          Tracking
        </p>
        <h1 className="font-mono text-2xl font-bold">{order.id}</h1>
        <p className="text-stone-600">
          Placed {when(order.createdAt)} · {etb(order.total ?? 0)}
        </p>
      </header>

      <TrackingView
        orderId={order.id}
        initialStatus={order.status}
        restaurant={restaurant}
        delivery={delivery}
        neighbourhood={order.neighbourhood ?? "Addis Ababa"}
        address={order.address}
      />

      <div className="flex justify-center gap-4">
        <Link href="/orders" className="text-amber-700 underline">
          ← My orders
        </Link>
        <Link href="/menu" className="text-amber-700 underline">
          Menu
        </Link>
      </div>
    </section>
  );
}