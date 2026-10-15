// src/app/admin/users/new/page.js
import Link from "next/link";
import UserForm from "../UserForm";

export const metadata = { title: "Admin · New user" };

export default function NewUserPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-wide text-stone-500">Admin</p>
        <h1 className="text-2xl font-bold text-stone-900">Add new user</h1>
        <p className="text-sm text-stone-500">Create an account. The user can sign in immediately.</p>
      </header>
      <UserForm />
      <Link href="/admin/users" className="inline-block text-sm text-[#A0522D] underline">
        ← Back to users
      </Link>
    </div>
  );
}