// src/components/SignOutButton.jsx
"use client";
import { signOutAction } from "@/app/actions";

export default function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button type="submit" className="text-stone-600 hover:text-amber-700">
        Sign out
      </button>
    </form>
  );
}