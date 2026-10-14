// src/app/admin/Sidebar.jsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutAction } from "@/app/actions";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/menu", label: "Dish Management" },
  { href: "/admin/orders", label: "Orders Management" },
  { href: "/admin/users", label: "User Management" },
];

export default function Sidebar({ user }) {
  const pathname = usePathname();

  function isActive(href) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-stone-200 bg-white">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-6">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-[#A0522D] text-sm font-bold text-white">
          AE
        </div>
        <div>
          <div className="text-sm font-semibold text-stone-900">Addis Eats</div>
          <div className="text-xs text-stone-500">Admin</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3">
        {NAV.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block min-h-[44px] rounded-lg px-4 py-3 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A0522D] ${
                active
                  ? "bg-[#A0522D] text-white"
                  : "text-stone-700 hover:bg-stone-100"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <form action={signOutAction} className="border-t border-stone-200 p-3">
        <button
          type="submit"
          className="flex w-full items-center gap-2 min-h-[44px] rounded-lg px-4 py-3 text-sm text-red-600 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        >
          ← Logout
        </button>
      </form>
    </aside>
  );
}