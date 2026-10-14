// src/app/admin/users/page.js
import { getUsers } from "@/lib/users";
import { toggleUserActiveAction } from "../actions";

export const dynamic = "force-dynamic";

export default function AdminUsersPage() {
  const users = getUsers();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-stone-900">User Management</h1>
        <p className="text-sm text-stone-500">
          {users.length} account{users.length === 1 ? "" : "s"}
        </p>
      </header>

      <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">All users</caption>
          <thead className="border-b border-stone-200 bg-stone-50">
            <tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Role</Th>
              <Th>Status</Th>
              <Th align="right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const active = u.active !== false;
              return (
                <tr key={u.id} className="border-b border-stone-100 last:border-b-0 hover:bg-stone-50/50">
                  <td className="px-4 py-3 font-medium text-stone-900">{u.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-stone-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                      u.role === "staff" ? "bg-violet-100 text-violet-800" : "bg-stone-100 text-stone-700"
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                      active ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-700"
                    }`}>
                      {active ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <form action={toggleUserActiveAction}>
                        <input type="hidden" name="id" value={u.id} />
                        <button
                          type="submit"
                          className="min-h-[36px] rounded-lg border border-stone-300 px-3 py-1 text-xs hover:bg-stone-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A0522D]"
                        >
                          {active ? "Disable" : "Enable"}
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children, align = "left" }) {
  return (
    <th scope="col" className={`px-4 py-3 text-xs font-medium uppercase tracking-wide text-stone-500 ${align === "right" ? "text-right" : ""}`}>
      {children}
    </th>
  );
}