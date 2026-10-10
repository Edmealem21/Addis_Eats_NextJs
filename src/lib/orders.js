// src/lib/orders.js
const orders = new Map();

export function addOrder(order) { orders.set(order.id, order); return order; }
export function getOrder(id) { return orders.get(id) ?? null; }
export function deleteOrder(id) { return orders.delete(id); }
export function newOrderId() { return "ord_" + Math.random().toString(36).slice(2, 10); }

export function listOrdersForUser(userId) {
  return Array.from(orders.values()).filter((o) => o.userId === userId);
}

export function listAllOrders() {
  return Array.from(orders.values());
}