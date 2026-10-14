import Link from "next/link";
import Image from "next/image";

export default function DishCard({ dish, priority = false }) {
  return (
    <li className="overflow-hidden rounded-lg border bg-white shadow-sm transition hover:shadow-md">
      <Link href={`/menu/${dish.id}`} className="group block">
        <div className="relative aspect-[4/3] w-full bg-stone-100">
          <Image
            src={dish.image}
            alt={`${dish.name} — ${dish.category}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            quality={70}
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        </div>
        <div className="space-y-1 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-stone-900">{dish.name}</h3>
            <span className="shrink-0 font-medium text-amber-700">{dish.price} ETB</span>
          </div>
          <p className="text-xs uppercase tracking-wide text-stone-500">{dish.category}</p>
          <p className="line-clamp-2 text-sm text-stone-600">{dish.description}</p>
        </div>
      </Link>
    </li>
  );
}