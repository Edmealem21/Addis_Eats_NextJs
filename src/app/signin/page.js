// src/app/signin/page.js
import Link from "next/link";
import SignInForm from "./SignInForm";

export const metadata = {
  title: "Sign in",
  description: "Sign in to your Addis Eats account to place and track orders.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/signin" },
};

function safeNext(value) {
  if (typeof value !== "string") return "/";
  if (!value.startsWith("/")) return "/";
  if (value.startsWith("//")) return "/";
  return value;
}

export default async function SignInPage({ searchParams }) {
  const sp = await searchParams;
  const next = safeNext(sp?.next);

  return (
    <section className="mx-auto max-w-md space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Sign in</h1>
        <p className="text-stone-600">Use one of the demo accounts to continue.</p>
      </header>

      <SignInForm next={next} />

      <div className="rounded border border-stone-200 bg-stone-50 p-4 text-sm text-stone-600">
        <p className="font-medium">Demo accounts</p>
        <ul className="mt-2 space-y-1 font-mono text-xs">
          <li>almaz@example.com / password1 (customer)</li>
          <li>kebede@example.com / password2 (customer)</li>
          <li>chef@addiseats.com / kitchen1 (staff)</li>
        </ul>
      </div>

      <Link href="/menu" className="text-amber-700 underline">← Back to menu</Link>
    </section>
  );
}