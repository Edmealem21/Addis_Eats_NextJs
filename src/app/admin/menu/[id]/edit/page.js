// src/app/admin/menu/[id]/edit/page.js
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDish } from "@/lib/dishes";
import DishForm from "../../DishForm";

export const dynamic = "force-dynamic";

export default async function EditDishPage({ params }) {
  const { id } = await params;
  const dish = await getDish(id);
  if (!dish) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-stone-900">Edit “{dish.name}”</h1>
      <DishForm dish={dish} />
      <Link href="/admin/menu" className="inline-block text-sm text-[#A0522D] underline">
        ← Back to dishes
      </Link>
    </div>
  );
}