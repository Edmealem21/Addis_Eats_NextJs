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

  const wrapperRef = useRef(null);
  const buttonRef = useRef(null);
  const panelRef = useRef(null);

  // Close the menu on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Outside-click + Escape, only attached while the menu is open.
  useEffect(() => {
    if (!open) return;

    function handlePointerDown(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setOpen(false);
        // Return focus to the toggle button so keyboard users stay oriented.
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  // When the menu opens, move focus to the first link.
  // When it closes, return focus to the button.
  useEffect(() => {
    if (open) {
      const firstLink = panelRef.current?.querySelector("a, button");
      firstLink?.focus();
    }
  }, [open]);

  // Toggle handler used by both click and key events.
  // Keyboard events on a <button> already fire `click` on Enter and Space,
  // but we handle them explicitly so the button also works when the browser
  // doesn't fire the synthetic click (some older ATs).
  function toggle() {
    setOpen((v) => !v);
  }

  function handleButtonKeyDown(e) {
    if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      toggle();
    }
  }

  function handlePanelKeyDown(e) {
    if (e.key === "Escape") {
      e.stopPropagation();
      setOpen(false);
      buttonRef.current?.focus();
    }
  }

  return (
    <div ref={wrapperRef} className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        onKeyDown={handleButtonKeyDown}
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-haspopup="true"
        className="grid h-11 w-11 place-items-center rounded hover:bg-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
      >
        {open ? (
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M6 18L18 6" />
          </svg>
        ) : (
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {open && (
        <div
          id="mobile-nav-panel"
          ref={panelRef}
          role="menu"
          onKeyDown={handlePanelKeyDown}
          className="absolute left-0 right-0 top-full border-b bg-white shadow-lg"
        >
          <nav className="flex flex-col p-3">
            <MenuItem href="/menu">Menu</MenuItem>
            <MenuItem href="/cart">Cart ({count})</MenuItem>
            <MenuItem href="/orders">My Orders</MenuItem>
            <MenuItem href="/checkout">Checkout</MenuItem>

            {session?.role === "staff" && (
              <>
                <MenuItem href="/admin">Admin</MenuItem>
                <MenuItem href="/kitchen">Kitchen</MenuItem>
              </>
            )}

            <div className="my-2 border-t border-stone-200" />

            {session ? (
              <div className="px-3 py-2">
                <SignOutButton />
              </div>
            ) : (
              <MenuItem href="/signin">
                <span className="text-amber-700">Sign in</span>
              </MenuItem>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}

function MenuItem({ href, children }) {
  return (
    <Link
      href={href}
      role="menuitem"
      className="rounded px-3 py-3 text-base hover:bg-amber-50 focus:outline-none focus-visible:bg-amber-50 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-inset"
    >
      {children}
    </Link>
  );
}