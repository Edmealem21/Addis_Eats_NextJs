// src/lib/users.js
export const users = [
  { id: "user-1", email: "almaz@example.com", password: "password1", name: "Almaz", role: "customer" },
  { id: "user-2", email: "kebede@example.com", password: "password2", name: "Kebede", role: "customer" },
  { id: "staff-1", email: "chef@addiseats.com", password: "kitchen1", name: "Chef Selam", role: "staff" },
];

export function findUserByCredentials(email, password) {
  return users.find((u) => u.email === email && u.password === password) ?? null;
}

export function findUserById(id) {
  return users.find((u) => u.id === id) ?? null;
}