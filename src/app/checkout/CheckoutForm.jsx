"use client";
import { useActionState, useRef } from "react";
import { useCartState } from "@/components/CartContext";
import { placeOrder } from "../actions";

export default function CheckoutForm() {
  const [state, formAction, pending] = useActionState(placeOrder, null);
  const { items } = useCartState();
  const submitted = useRef(false);

  function handleSubmit(e) {
    if (submitted.current) {
      e.preventDefault();
      return;
    }
    submitted.current = true;
  }

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
        <a
          href={`/orders/${state.orderId}`}
          className="inline-block min-h-[44px] rounded bg-amber-600 px-4 py-2 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
        >
          Track order →
        </a>
      </div>
    );
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} className="max-w-md space-y-4">
      <input
        type="hidden"
        name="items"
        value={JSON.stringify(items.map((i) => ({ id: i.id, quantity: i.quantity })))}
      />

      {state?.error && (
        <p className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700" role="alert">
          {state.error}
        </p>
      )}

      <Field name="name" label="Name" autoComplete="name" errors={state?.fieldErrors?.name} />
      <Field name="email" label="Email" type="email" autoComplete="email" errors={state?.fieldErrors?.email} />
      <Field name="phone" label="Phone" type="tel" autoComplete="tel" errors={state?.fieldErrors?.phone} />
      <Field name="address" label="Address" autoComplete="street-address" errors={state?.fieldErrors?.address} />
      <Field name="notes" label="Notes" errors={state?.fieldErrors?.notes} />

      <button
        type="submit"
        disabled={pending}
        aria-busy={pending}
        className="min-h-[44px] rounded bg-amber-600 px-4 py-2 text-white disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
      >
        {pending ? "Placing order…" : "Place order"}
      </button>
    </form>
  );
}

function Field({ name, label, type = "text", autoComplete, errors }) {
  const id = `field-${name}`;
  const errorId = `${id}-error`;
  return (
    <div>
      <label className="block text-sm font-medium" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        aria-invalid={errors ? "true" : undefined}
        aria-describedby={errors ? errorId : undefined}
        className="mt-1 min-h-[44px] w-full rounded border border-stone-300 px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:border-amber-500"
      />
      {errors && (
        <p id={errorId} className="mt-1 text-sm text-red-600">
          {errors[0]}
        </p>
      )}
    </div>
  );
}