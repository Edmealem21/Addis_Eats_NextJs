// src/app/page.js
import Link from "next/link";
import Image from "next/image";
import { dishes } from "@/lib/dishes";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata = {
  title: "Home",
  description:
    "Order authentic Ethiopian food online — injera, doro wat, kitfo, shiro and more, delivered hot from Bole to your door in 30–45 minutes.",
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE_NAME} — Authentic Ethiopian Food, Delivered`,
    description: "Order authentic Ethiopian food online.",
    url: SITE_URL,
  },
};

export default function HomePage() {
  const special = dishes[0];

  return (
    <div className="space-y-12">
      <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-red-700 text-white">
        <div className="grid gap-4 p-4 sm:p-5 md:grid-cols-2 md:items-center md:p-6">
          <div className="space-y-3">
            <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
              Authentic Ethiopian food, delivered hot.
            </h1>
            <p className="max-w-md text-sm text-amber-50/90">
              Injera, tibs, shiro and more — sent to your door.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/menu" className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-amber-700 shadow hover:bg-amber-50">
                Order now
              </Link>
              <Link href="/menu?category=veg" className="rounded-lg border border-white/40 px-4 py-2 text-sm font-medium text-white hover:bg-white/10">
                Vegetarian
              </Link>
            </div>
          </div>

          <div className="relative hidden aspect-[16/9] w-full overflow-hidden rounded-xl">
            <Image
              src={special.image}
              alt={`${special.name} — today's special`}
              fill
              sizes="(max-width: 1024px) 50vw, 400px"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold">Today&apos;s special</h2>
            <p className="text-sm text-stone-600">Handpicked by our chef</p>
          </div>
          <Link href="/menu" className="text-sm text-amber-700 hover:underline">
            See full menu →
          </Link>
        </div>

        <Link href={`/menu/${special.id}`} className="group block max-w-xs overflow-hidden rounded-xl border bg-white transition hover:shadow-lg">
          <div className="relative aspect-[4/3] w-full bg-stone-100">
            <Image
              src={special.image}
              alt={`${special.name} — ${special.category}`}
              fill
              sizes="320px"
              className="object-cover transition duration-300 group-hover:scale-105"
            />
          </div>
          <div className="p-4">
            <p className="font-semibold">{special.name}</p>
            <p className="text-sm text-stone-500">{special.price} ETB</p>
          </div>
        </Link>
      </section>
    </div>
  );
}