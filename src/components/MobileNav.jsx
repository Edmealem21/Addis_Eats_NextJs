// src/components/MobileNav.jsx
"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartState } from "./CartContext";
import SignOutButton from "./SignOutButton";

export default function MobileNav({ session }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { items } = useCartState();
  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const ref = useRef(null);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="md:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="grid h-9 w-9 place-items-center rounded hover:bg-stone-100"
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M6 18L18 6" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full border-b bg-white shadow-lg">
          <nav className="flex flex-col p-3">
            <MenuItem href="/menu">Menu</MenuItem>
            <MenuItem href="/cart">Cart ({count})</MenuItem>
            <MenuItem href="/orders">My Orders</MenuItem>
            <MenuItem href="/checkout">Checkout</MenuItem>
            {session?.role === "staff" && <MenuItem href="/kitchen">Kitchen</MenuItem>}
            <div className="my-2 border-t border-stone-200" />
            {session ? (
              <div className="px-3 py-2"><SignOutButton /></div>
            ) : (
              <MenuItem href="/signin"><span className="text-amber-700">Sign in</span></MenuItem>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}

function MenuItem({ href, children }) {
  return (
    <Link href={href} className="rounded px-3 py-2 text-base hover:bg-amber-50">
      {children}
    </Link>
  );
}