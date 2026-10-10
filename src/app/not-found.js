// src/app/not-found.js
import Link from "next/link";

export const metadata = {
  title: "Not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="space-y-4 text-center">
      <h1 className="text-3xl font-bold">Not found</h1>
      <p className="text-stone-600">We couldn&apos;t find what you were looking for.</p>
      <Link href="/menu" className="inline-block rounded bg-amber-600 px-4 py-2 text-white">
        Back to menu
      </Link>
    </section>
  );
}