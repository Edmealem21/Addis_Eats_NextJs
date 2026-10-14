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

  const session = await getSession();
  if (!session) redirect(`/signin?next=/track/${id}`);

  const order = getOrder(id);
  if (!order) notFound();
  if (order.userId !== session.userId) notFound();

  const { restaurant, delivery } = coordsFor(order.neighbourhood);

  return (
    <section className="space-y-8">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-wide text-stone-500">
          Tracking
        </p>
        <h1 className="font-mono text-2xl font-bold">{order.id}</h1>
        <p className="text-stone-600">
          Placed {when(order.createdAt)} · {etb(order.total)}
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

      <div className="flex gap-4">
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