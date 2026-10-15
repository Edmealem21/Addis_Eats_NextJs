// src/app/admin/users/UserForm.jsx
"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createUserAction } from "../actions";

export default function UserForm() {
  const [state, formAction, pending] = useActionState(createUserAction, null);

  return (
    <form
      action={formAction}
      className="max-w-xl space-y-5 rounded-xl border border-stone-200 bg-white p-6 shadow-sm"
    >
      {state?.error && (
        <p role="alert" className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <div>
        <label className="block text-sm font-medium text-stone-700" htmlFor="f-name">Full name</label>
        <input id="f-name" name="name" type="text" autoComplete="name" required
          className="mt-1 min-h-[44px] w-full rounded-lg border border-stone-300 px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A0522D]" />
        {state?.fieldErrors?.name && <p className="mt-1 text-sm text-red-600">{state.fieldErrors.name[0]}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700" htmlFor="f-email">Email</label>
        <input id="f-email" name="email" type="email" autoComplete="email" required
          className="mt-1 min-h-[44px] w-full rounded-lg border border-stone-300 px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A0522D]" />
        {state?.fieldErrors?.email && <p className="mt-1 text-sm text-red-600">{state.fieldErrors.email[0]}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700" htmlFor="f-password">Password</label>
        <input id="f-password" name="password" type="text" required minLength={6}
          className="mt-1 min-h-[44px] w-full rounded-lg border border-stone-300 px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A0522D]" />
        <p className="mt-1 text-xs text-stone-500">Minimum 6 characters.</p>
        {state?.fieldErrors?.password && <p className="mt-1 text-sm text-red-600">{state.fieldErrors.password[0]}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700" htmlFor="f-role">Role</label>
        <select id="f-role" name="role" defaultValue="customer"
          className="mt-1 min-h-[44px] w-full rounded-lg border border-stone-300 bg-white px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A0522D]">
          <option value="customer">Customer</option>
          <option value="staff">Staff</option>
        </select>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={pending} aria-busy={pending}
          className="min-h-[44px] rounded-lg bg-[#A0522D] px-5 py-2 text-sm font-medium text-white hover:bg-[#8B4513] disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A0522D] focus-visible:ring-offset-2">
          {pending ? "Creating…" : "Create user"}
        </button>
        <Link href="/admin/users"
          className="min-h-[44px] rounded-lg border border-stone-300 px-5 py-2 text-sm hover:bg-stone-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A0522D]">
          Cancel
        </Link>
      </div>
    </form>
  );
}