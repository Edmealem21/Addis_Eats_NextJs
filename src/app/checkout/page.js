// src/app/checkout/page.js
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import CheckoutForm from "./CheckoutForm";

export const metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const session = await getSession();
  if (!session) redirect("/signin?next=/checkout");

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Checkout</h1>
      <p className="text-sm text-stone-500">
        Signed in as <strong>{session.userId}</strong>
      </p>
      <CheckoutForm />
    </section>
  );
}