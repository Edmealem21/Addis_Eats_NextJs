// src/app/actions.js
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { orderSchema } from "@/lib/schema";
import { addOrder, newOrderId, getOrder, deleteOrder } from "@/lib/orders";
import { findUserByCredentials } from "@/lib/users";
import { getSession, createSession, destroySession } from "@/lib/session";
import { getDish } from "@/lib/dishes";

function safeNext(value) {
  if (typeof value !== "string") return "/";
  if (!value.startsWith("/")) return "/";
  if (value.startsWith("//")) return "/";
  return value;
}

export async function signInAction(_prevState, formData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(String(formData.get("next") ?? "/"));

  // MUST AWAIT this! It queries Vercel KV now.
  const user = await findUserByCredentials(email, password);
  
  if (!user) return { ok: false, error: "Invalid email or password." };

  await createSession({ userId: user.id, role: user.role });
  redirect(next);
}

export async function signOutAction() {
  await destroySession();
  redirect("/");
}

export async function placeOrder(_prevState, formData) {
  const session = await getSession();
  if (!session) return { ok: false, error: "Please sign in to place an order." };

  const itemsRaw = formData.get("items");
  let items = [];
  try { items = itemsRaw ? JSON.parse(itemsRaw) : []; } catch { items = []; }

  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    notes: formData.get("notes") || undefined,
    items,
  };

  const parsed = orderSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const total = (
    await Promise.all(
      parsed.data.items.map(async (i) => {
        const dish = await getDish(i.id);
        const unitPrice = dish?.price ?? 0;
        return unitPrice * i.quantity;
      })
    )
  ).reduce((sum, n) => sum + n, 0);

  const addr = String(parsed.data.address ?? "");
  const neighbourhood = addr.split(",")[0].trim() || "Unknown";

  // MUST AWAIT this! It writes to Vercel KV now.
  const order = await addOrder({
    id: newOrderId(),
    userId: session.userId,
    createdAt: new Date().toISOString(),
    status: "pending",
    total,
    neighbourhood,
    ...parsed.data,
  });

  revalidatePath("/checkout");
  revalidatePath("/orders");
  return { ok: true, orderId: order.id, total };
}

export async function cancelOrder(_prevState, formData) {
  const session = await getSession();
  if (!session) return { ok: false, error: "Please sign in." };

  const orderId = String(formData.get("orderId") ?? "");
  
  // MUST AWAIT these!
  const order = await getOrder(orderId);
  if (!order) return { ok: false, error: "Order not found." };
  
  if (order.userId !== session.userId) {
    return { ok: false, error: "You don't own this order." };
  }

  await deleteOrder(orderId);
  revalidatePath("/orders");
  return { ok: true };
}