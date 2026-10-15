// src/app/admin/Sidebar.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { signOutAction } from "@/app/actions";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/menu", label: "Dish Management" },
  { href: "/admin/orders", label: "Orders Management" },
  { href: "/admin/users", label: "User Management" },
];

export default function Sidebar({ user }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close on route change (after clicking a nav link).
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function isActive(href) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <>
      {/* Toggle button — visible only on small screens */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
        aria-expanded={open}
        aria-controls="admin-sidebar"
        className="fixed left-3 top-20 z-50 grid h-11 w-11 place-items-center rounded-full bg-[#A0522D] text-xl font-bold text-white shadow-lg hover:bg-[#8B4513] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40 lg:hidden"
      >
        {open ? "‹" : "›"}
      </button>

      {/* Backdrop — only when open on small screens */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        id="admin-sidebar"
        className={`fixed bottom-0 left-0 top-16 z-40 flex w-60 shrink-0 flex-col border-r border-stone-200 bg-white transition-transform duration-200 ease-out lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
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
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
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
            className="flex min-h-[44px] w-full items-center gap-2 rounded-lg px-4 py-3 text-sm text-red-600 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            ← Logout
          </button>
        </form>
      </aside>
    </>
  );
}