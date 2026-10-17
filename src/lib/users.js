// src/lib/users.js
import { kv } from "@vercel/kv";

const DEFAULTS = [
  { id: "user-1", email: "almaz@example.com", password: "password1", name: "Almaz", role: "customer", active: true },
  { id: "user-2", email: "kebede@example.com", password: "password2", name: "Kebede", role: "customer", active: true },
  { id: "staff-1", email: "chef@addiseats.com", password: "kitchen1", name: "Chef Selam", role: "staff", active: true },
];

async function readUsers() {
  let list = await kv.get("users:all");
  if (!list) {
    await kv.set("users:all", DEFAULTS);
    list = DEFAULTS;
  }
  return list;
}

export async function getUsers() {
  return await readUsers();
}

export async function findUserByCredentials(email, password) {
  const list = await readUsers();
  const u = list.find((x) => x.email === email && x.password === password);
  if (!u || u.active === false) return null;
  return u;
}

export async function findUserById(id) {
  const list = await readUsers();
  return list.find((u) => u.id === id) ?? null;
}

export async function toggleUserActive(id) {
  const list = await readUsers();
  const idx = list.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  list[idx].active = !list[idx].active;
  await kv.set("users:all", list);
  return list[idx];
}

export async function createUser({ email, password, name, role }) {
  const list = await readUsers();
  const normalizedEmail = String(email).toLowerCase().trim();
  if (list.some((u) => u.email.toLowerCase() === normalizedEmail)) {
    throw new Error(`A user with email "${email}" already exists.`);
  }
  const user = {
    id: "user-" + Math.random().toString(36).slice(2, 10),
    email: normalizedEmail,
    password,
    name: name.trim(),
    role: role === "staff" ? "staff" : "customer",
    active: true,
  };
  list.push(user);
  await kv.set("users:all", list);
  return user;
}

export async function deleteUser(id) {
  const list = await readUsers();
  const next = list.filter((u) => u.id !== id);
  if (next.length === list.length) return false;
  await kv.set("users:all", next);
  return true;
}

export const users = DEFAULTS; // Backwards compat fallback