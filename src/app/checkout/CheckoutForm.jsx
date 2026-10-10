// src/app/checkout/CheckoutForm.jsx
"use client";
import { useActionState } from "react";
import { useCartState } from "@/components/CartContext";
import { placeOrder } from "../actions";

export default function CheckoutForm() {
  const [state, formAction, pending] = useActionState(placeOrder, null);
  const { items } = useCartState();

  if (state?.ok) {
    return (
      <div className="max-w-md space-y-4 rounded-lg border border-green-300 bg-green-50 p-6">
        <h2 className="text-xl font-bold text-green-800">Order placed ✓</h2>
        <p className="text-green-700">Thank you. We&apos;ll call you to confirm.</p>
        <dl className="space-y-1 text-sm">
          <div className="flex justify-between">
            <dt className="text-stone-600">Order ID</dt>
            <dd className="font-mono">{state.orderId}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-stone-600">Total</dt>
            <dd className="font-medium">{state.total} ETB</dd>
          </div>
        </dl>
        <a href={`/orders/${state.orderId}`} className="inline-block rounded bg-amber-600 px-4 py-2 text-white">
          Track order →
        </a>
      </div>
    );
  }

  return (
    <form action={formAction} className="max-w-md space-y-4">
      <input type="hidden" name="items"
        value={JSON.stringify(items.map((i) => ({ id: i.id, quantity: i.quantity })))} />

      {state?.error && (
        <p className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <Field name="name" label="Name" errors={state?.fieldErrors?.name} />
      <Field name="email" label="Email" type="email" errors={state?.fieldErrors?.email} />
      <Field name="phone" label="Phone" errors={state?.fieldErrors?.phone} />
      <Field name="address" label="Address" errors={state?.fieldErrors?.address} />
      <Field name="notes" label="Notes" errors={state?.fieldErrors?.notes} />

      <button type="submit" disabled={pending}
        className="rounded bg-amber-600 px-4 py-2 text-white disabled:opacity-50">
        {pending ? "Placing order…" : "Place order"}
      </button>
    </form>
  );
}

function Field({ name, label, type = "text", errors }) {
  return (
    <div>
      <label className="block text-sm font-medium" htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type}
        className="mt-1 w-full rounded border px-3 py-2" />
      {errors && <p className="mt-1 text-sm text-red-600">{errors[0]}</p>}
    </div>
  );
}