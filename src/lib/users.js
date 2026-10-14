// src/lib/users.js
import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), ".users.json");

const DEFAULTS = [
  { id: "user-1", email: "almaz@example.com", password: "password1", name: "Almaz", role: "customer", active: true },
  { id: "user-2", email: "kebede@example.com", password: "password2", name: "Kebede", role: "customer", active: true },
  { id: "staff-1", email: "chef@addiseats.com", password: "kitchen1", name: "Chef Selam", role: "staff", active: true },
];

function read() {
  try {
    if (!fs.existsSync(FILE)) {
      fs.writeFileSync(FILE, JSON.stringify(DEFAULTS, null, 2));
      return DEFAULTS;
    }
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {
    return DEFAULTS;
  }
}

function write(list) {
  try { fs.writeFileSync(FILE, JSON.stringify(list, null, 2)); } catch {}
}

export function getUsers() { return read(); }
export const users = DEFAULTS;

export function findUserByCredentials(email, password) {
  const u = read().find((x) => x.email === email && x.password === password);
  if (!u || u.active === false) return null;
  return u;
}

export function findUserById(id) {
  return read().find((u) => u.id === id) ?? null;
}

export function toggleUserActive(id) {
  const list = read();
  const idx = list.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  list[idx].active = !list[idx].active;
  write(list);
  return list[idx];
}