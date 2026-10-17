// src/lib/orders.js
import { kv } from "@vercel/kv";

export async function addOrder(order) {
  await kv.set(`order:${order.id}`, order);
  const ts = new Date(order.createdAt).getTime();
  await kv.zadd(`user:${order.userId}:orders`, { score: ts, member: order.id });
  await kv.zadd("orders:all", { score: ts, member: order.id });
  return order;
}

export async function getOrder(id) {
  return (await kv.get(`order:${id}`)) ?? null;
}

export async function deleteOrder(id) {
  const order = await kv.get(`order:${id}`);
  if (!order) return false;
  await kv.del(`order:${id}`);
  await kv.zrem(`user:${order.userId}:orders`, id);
  await kv.zrem("orders:all", id);
  return true;
}

export function newOrderId() {
  return "ord_" + Math.random().toString(36).slice(2, 10);
}

export async function listOrdersForUser(userId) {
  const ids = await kv.zrange(`user:${userId}:orders`, 0, -1, { rev: true });
  if (!ids || ids.length === 0) return [];
  const orders = await Promise.all(ids.map((id) => kv.get(`order:${id}`)));
  return orders.filter(Boolean);
}

export async function listAllOrders() {
  const ids = await kv.zrange("orders:all", 0, -1, { rev: true });
  if (!ids || ids.length === 0) return [];
  const orders = await Promise.all(ids.map((id) => kv.get(`order:${id}`)));
  return orders.filter(Boolean);
}

export async function updateOrderStatus(id, status) {
  const order = await kv.get(`order:${id}`);
  if (!order) return false;
  await kv.set(`order:${id}`, { ...order, status });
  return true;
}

export async function sumTotals(predicate = () => true) {
  return (await listAllOrders()).filter(predicate).reduce((s, o) => s + (o.total ?? 0), 0);
}

export async function revenueBy(keyFn) {
  const groups = new Map();
  for (const o of await listAllOrders()) {
    const key = keyFn(o);
    groups.set(key, (groups.get(key) ?? 0) + (o.total ?? 0));
  }
  return Array.from(groups, ([key, value]) => ({ key, value }));
}

export async function countBy(keyFn) {
  const groups = new Map();
  for (const o of await listAllOrders()) {
    const key = keyFn(o);
    groups.set(key, (groups.get(key) ?? 0) + 1);
  }
  return Array.from(groups, ([key, value]) => ({ key, value }));
}