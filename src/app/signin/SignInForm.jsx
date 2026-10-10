// src/app/signin/SignInForm.jsx
"use client";
import { useActionState } from "react";
import { signInAction } from "../actions";

export default function SignInForm({ next }) {
  const [state, formAction, pending] = useActionState(signInAction, null);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={next} />

      {state?.error && (
        <p className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <div>
        <label className="block text-sm font-medium" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required autoComplete="email"
          defaultValue="almaz@example.com"
          className="mt-1 w-full rounded border px-3 py-2" />
      </div>

      <div>
        <label className="block text-sm font-medium" htmlFor="password">Password</label>
        <input id="password" name="password" type="password" required
          autoComplete="current-password" defaultValue="password1"
          className="mt-1 w-full rounded border px-3 py-2" />
      </div>

      <button type="submit" disabled={pending}
        className="rounded bg-amber-600 px-4 py-2 text-white disabled:opacity-50">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}