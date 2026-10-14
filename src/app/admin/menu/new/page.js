// src/app/admin/menu/new/page.js
import Link from "next/link";
import DishForm from "../DishForm";

export default function NewDishPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-stone-900">Add New Dish</h1>
      <DishForm />
      <Link href="/admin/menu" className="inline-block text-sm text-[#A0522D] underline">
        ← Back to dishes
      </Link>
    </div>
  );
}