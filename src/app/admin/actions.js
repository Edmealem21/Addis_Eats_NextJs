// src/app/admin/actions.js
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import {
  createDish, updateDish, deleteDish, toggleDishActive, resetDishes,
} from "@/lib/dishes";
import { toggleUserActive } from "@/lib/users";
import { listAllOrders, updateOrderStatus, deleteOrder } from "@/lib/orders";

const CATEGORIES = ["Ethiopian", "Burgers", "Drinks", "Veg", "Mains"];
const STATUSES = ["pending", "preparing", "delivering", "delivered"];

async function requireStaff() {
  const session = await getSession();
  if (!session) throw new Error("Not authenticated");
  if (session.role !== "staff") throw new Error("Not authorised");
  return session;
}

function slugify(s) {
  return String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function validateDish(f) {
  const errors = {};
  if (!f.name || f.name.length < 2) errors.name = ["Name is required."];
  if (!f.category || !CATEGORIES.includes(f.category)) errors.category = ["Pick a valid category."];
  const price = Number(f.price);
  if (!Number.isFinite(price) || price <= 0) errors.price = ["Enter a positive price."];
  if (!f.description || f.description.length < 10) errors.description = ["Description must be at least 10 characters."];
  if (!f.image || !f.image.startsWith("/")) errors.image = ["Image path must start with /."];
  return { errors, price };
}

// ── DISHES ───────────────────────────────────────────────────

export async function createDishAction(_prev, formData) {
  await requireStaff();
  const fields = {
    name: String(formData.get("name") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
    price: formData.get("price"),
    description: String(formData.get("description") ?? "").trim(),
    image: String(formData.get("image") ?? "").trim(),
    featured: formData.get("featured") === "on",
  };
  const { errors, price } = validateDish(fields);
  if (Object.keys(errors).length) return { ok: false, error: "Validation failed", fieldErrors: errors };

  try {
    await createDish({
      id: slugify(fields.name),
      name: fields.name,
      category: fields.category,
      price: Math.round(price),
      description: fields.description,
      image: fields.image,
      featured: fields.featured,
      active: true,
      rating: 4.5,
    });
  } catch (err) {
    return { ok: false, error: err.message };
  }
  revalidatePath("/admin/menu");
  revalidatePath("/menu");
  redirect("/admin/menu");
}

export async function updateDishAction(_prev, formData) {
  await requireStaff();
  const id = String(formData.get("id") ?? "");
  const fields = {
    name: String(formData.get("name") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
    price: formData.get("price"),
    description: String(formData.get("description") ?? "").trim(),
    image: String(formData.get("image") ?? "").trim(),
    featured: formData.get("featured") === "on",
  };
  const { errors, price } = validateDish(fields);
  if (Object.keys(errors).length) return { ok: false, error: "Validation failed", fieldErrors: errors };

  try {
    await updateDish(id, { ...fields, price: Math.round(price) });
  } catch (err) {
    return { ok: false, error: err.message };
  }
  revalidatePath("/admin/menu");
  revalidatePath("/menu");
  revalidatePath(`/menu/${id}`);
  redirect("/admin/menu");
}

export async function toggleDishActiveAction(formData) {
  await requireStaff();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await toggleDishActive(id);
  revalidatePath("/admin/menu");
  revalidatePath("/menu");
}

export async function deleteDishAction(formData) {
  await requireStaff();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await deleteDish(id);
  revalidatePath("/admin/menu");
  revalidatePath("/menu");
}

export async function resetDishesAction() {
  await requireStaff();
  await resetDishes();
  revalidatePath("/admin/menu");
  revalidatePath("/menu");
}

// ── ORDERS ───────────────────────────────────────────────────

export async function updateOrderStatusAction(formData) {
  await requireStaff();
  const orderId = String(formData.get("orderId") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!STATUSES.includes(status)) return;
  await updateOrderStatus(orderId, status);
  revalidatePath("/admin/orders");
  revalidatePath("/orders");
  revalidatePath("/dashboard");
}

export async function deleteOrderAction(formData) {
  await requireStaff();
  const orderId = String(formData.get("orderId") ?? "");
  if (!orderId) return;
  deleteOrder(orderId);
  revalidatePath("/admin/orders");
  revalidatePath("/orders");
}

// ── USERS ────────────────────────────────────────────────────

export async function toggleUserActiveAction(formData) {
  await requireStaff();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  toggleUserActive(id);
  revalidatePath("/admin/users");
}