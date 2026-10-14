// src/app/admin/menu/DishForm.jsx
"use client";
import { useActionState } from "react";
import Link from "next/link";
import { createDishAction, updateDishAction } from "../actions";

const CATEGORIES = ["Ethiopian", "Burgers", "Drinks", "Veg", "Mains"];
const SAMPLE_IMAGES = [
  "/dishes/doro-wat.jpg", "/dishes/kitfo.jpg", "/dishes/shiro.jpg",
  "/dishes/tibs.jpg", "/dishes/misir-wat.jpg", "/dishes/gomen.jpg",
  "/dishes/firfir.jpg", "/dishes/beyaynet.jpg",
];

export default function DishForm({ dish }) {
  const isEdit = Boolean(dish);
  const [state, formAction, pending] = useActionState(
    isEdit ? updateDishAction : createDishAction,
    null
  );

  return (
    <form action={formAction} className="max-w-xl space-y-5 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
      {isEdit && <input type="hidden" name="id" value={dish.id} />}

      {state?.error && (
        <p role="alert" className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <Field name="name" label="Name" defaultValue={dish?.name} placeholder="Special Doro Wat"
        errors={state?.fieldErrors?.name} />

      <div>
        <label className="block text-sm font-medium text-stone-700" htmlFor="f-cat">Category</label>
        <select id="f-cat" name="category" defaultValue={dish?.category ?? "Ethiopian"}
          className="mt-1 min-h-[44px] w-full rounded-lg border border-stone-300 bg-white px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A0522D]">
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <Field name="price" label="Price (ETB)" type="number" defaultValue={dish?.price} placeholder="520"
        errors={state?.fieldErrors?.price} />

      <div>
        <label className="block text-sm font-medium text-stone-700" htmlFor="f-desc">Description</label>
        <textarea id="f-desc" name="description" rows={3} defaultValue={dish?.description}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A0522D]" />
        {state?.fieldErrors?.description && (
          <p className="mt-1 text-sm text-red-600">{state.fieldErrors.description[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700" htmlFor="f-img">Image path</label>
        <input id="f-img" name="image" list="img-list" defaultValue={dish?.image ?? "/dishes/doro-wat.jpg"}
          className="mt-1 min-h-[44px] w-full rounded-lg border border-stone-300 px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A0522D]" />
        <datalist id="img-list">
          {SAMPLE_IMAGES.map((p) => <option key={p} value={p} />)}
        </datalist>
        {state?.fieldErrors?.image && (
          <p className="mt-1 text-sm text-red-600">{state.fieldErrors.image[0]}</p>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm text-stone-700">
        <input type="checkbox" name="featured" defaultChecked={dish?.featured}
          className="h-4 w-4 rounded border-stone-300 text-[#A0522D] focus:ring-[#A0522D]" />
        Featured dish
      </label>

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={pending} aria-busy={pending}
          className="min-h-[44px] rounded-lg bg-[#A0522D] px-5 py-2 text-sm font-medium text-white hover:bg-[#8B4513] disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A0522D] focus-visible:ring-offset-2">
          {pending ? "Saving…" : isEdit ? "Save changes" : "Create dish"}
        </button>
        <Link href="/admin/menu"
          className="min-h-[44px] rounded-lg border border-stone-300 px-5 py-2 text-sm hover:bg-stone-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A0522D]">
          Cancel
        </Link>
      </div>
    </form>
  );
}

function Field({ name, label, type = "text", defaultValue, placeholder, errors }) {
  const id = `f-${name}`;
  return (
    <div>
      <label className="block text-sm font-medium text-stone-700" htmlFor={id}>{label}</label>
      <input id={id} name={name} type={type} defaultValue={defaultValue} placeholder={placeholder}
        aria-invalid={errors ? "true" : undefined}
        className="mt-1 min-h-[44px] w-full rounded-lg border border-stone-300 px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A0522D]" />
      {errors && <p className="mt-1 text-sm text-red-600">{errors[0]}</p>}
    </div>
  );
}