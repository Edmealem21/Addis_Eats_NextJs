// src/app/admin/menu/DishManager.jsx
"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import {
  toggleDishActiveAction, deleteDishAction, resetDishesAction,
} from "../actions";
import { etb } from "@/lib/format";

export default function DishManager({ dishes }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    let list = dishes;
    if (filter === "active") list = list.filter((d) => d.active !== false);
    if (filter === "disabled") list = list.filter((d) => d.active === false);
    if (filter === "featured") list = list.filter((d) => d.featured);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [dishes, query, filter]);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Dish Management</h1>
          <p className="text-sm text-stone-500">
            Add, update prices, edit ingredients, or remove dishes.
          </p>
        </div>
        <div className="flex gap-2">
          <form action={resetDishesAction}>
            <button
              type="submit"
              className="min-h-[44px] rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A0522D]"
            >
              ↻ Reset Seed Data
            </button>
          </form>
          <Link
            href="/admin/menu/new"
            className="min-h-[44px] rounded-lg bg-[#A0522D] px-4 py-2 text-sm font-medium text-white hover:bg-[#8B4513] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A0522D] focus-visible:ring-offset-2"
          >
            + Add New Dish
          </Link>
        </div>
      </header>

      {/* Search + filters */}
      <div className="space-y-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍 Search dish by name, category…"
          aria-label="Search dishes"
          className="min-h-[44px] w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A0522D]"
        />
        <div className="flex flex-wrap gap-2">
          {[
            { key: "all", label: "All" },
            { key: "active", label: "Active" },
            { key: "disabled", label: "Disabled" },
            { key: "featured", label: "Featured" },
          ].map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`min-h-[36px] rounded-full px-4 py-1.5 text-xs font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A0522D] ${
                filter === f.key
                  ? "bg-[#A0522D] text-white"
                  : "border border-stone-300 bg-white text-stone-700 hover:bg-stone-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-stone-500">
          Showing {filtered.length} of {dishes.length} dishes
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">All dishes</caption>
          <thead className="border-b border-stone-200 bg-stone-50">
            <tr>
              <Th>Dish</Th>
              <Th>Category</Th>
              <Th align="right">Price (ETB)</Th>
              <Th>Status</Th>
              <Th>Rating</Th>
              <Th align="right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-10 text-center text-sm text-stone-500">
                  No dishes match.
                </td>
              </tr>
            ) : (
              filtered.map((dish) => (
                <DishRow key={dish.id} dish={dish} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DishRow({ dish }) {
  const active = dish.active !== false;

  return (
    <tr className="border-b border-stone-100 last:border-b-0 hover:bg-stone-50/50">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={dish.image}
            alt={dish.name}
            width={40}
            height={40}
            className="h-10 w-10 shrink-0 rounded-lg object-cover"
          />
          <div>
            <div className={`font-medium ${active ? "text-stone-900" : "text-stone-400"}`}>
              {dish.name}
            </div>
            {dish.featured && (
              <div className="text-xs text-amber-600">Featured</div>
            )}
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-stone-600">{dish.category}</td>
      <td className="px-4 py-3 text-right tabular-nums text-stone-700">
        {etb(dish.price)}
      </td>
      <td className="px-4 py-3">
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
            active
              ? "bg-emerald-100 text-emerald-800"
              : "bg-stone-100 text-stone-500"
          }`}
        >
          {active ? "Active" : "Disabled"}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className="text-amber-500">★</span>{" "}
        <span className="text-stone-700">{dish.rating ?? "—"}</span>
      </td>
      <td className="px-4 py-3">
        <div className="flex justify-end gap-1">
          <Link
            href={`/admin/menu/${dish.id}/edit`}
            aria-label={`Edit ${dish.name}`}
            className="grid h-9 w-9 place-items-center rounded-lg hover:bg-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A0522D]"
          >
            ✏️
          </Link>
          <form action={toggleDishActiveAction}>
            <input type="hidden" name="id" value={dish.id} />
            <button
              type="submit"
              aria-label={active ? `Disable ${dish.name}` : `Enable ${dish.name}`}
              className="grid h-9 w-9 place-items-center rounded-lg hover:bg-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A0522D]"
            >
              {active ? "✅" : "🚫"}
            </button>
          </form>
          <form action={deleteDishAction}>
            <input type="hidden" name="id" value={dish.id} />
            <button
              type="submit"
              aria-label={`Delete ${dish.name}`}
              className="grid h-9 w-9 place-items-center rounded-lg text-red-600 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              onClick={(e) => {
                if (!confirm(`Delete "${dish.name}"?`)) e.preventDefault();
              }}
            >
              🗑️
            </button>
          </form>
        </div>
      </td>
    </tr>
  );
}

function Th({ children, align = "left" }) {
  return (
    <th
      scope="col"
      className={`px-4 py-3 text-xs font-medium uppercase tracking-wide text-stone-500 ${
        align === "right" ? "text-right" : ""
      }`}
    >
      {children}
    </th>
  );
}