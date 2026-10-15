// src/components/ArrowNav.jsx
"use client";

import { useEffect } from "react";

// Collect every focusable element that's actually rendered (has size).
// getBoundingClientRect is more reliable than offsetParent because
// some layouts leave offsetParent null even for visible elements.
function visibleFocusables(root) {
  const sel =
    'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  return Array.from(root.querySelectorAll(sel)).filter((el) => {
    if (el.hidden) return false;
    if (el.getAttribute("aria-hidden") === "true") return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  });
}

function isTextLike(el) {
  if (!el) return false;
  if (el.isContentEditable) return true;
  if (el.tagName === "TEXTAREA") return true;
  if (el.tagName !== "INPUT") return false;
  const t = el.type;
  return ["text", "email", "tel", "password", "search", "url", "number", "date"].includes(t);
}

function focusNext(el, e) {
  if (!el) return false;
  e.preventDefault();
  e.stopPropagation();
  el.focus();
  el.scrollIntoView({ block: "nearest", inline: "nearest" });
  return true;
}

export default function ArrowNav() {
  useEffect(() => {
    function onKey(e) {
      const key = e.key;
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) return;
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      // Use the actual focused element — more reliable than e.target.
      const active = document.activeElement;
      if (!active || active === document.body || active === document.documentElement) {
        // Nothing focused — send focus to the first focusable on the page.
        const first = visibleFocusables(document)[0];
        if (first) focusNext(first, e);
        return;
      }

      const forward = key === "ArrowDown" || key === "ArrowRight";

      // ── 1. DISH CARDS — cycle between cards only ──────────
      const card = active.closest?.("[data-dish-card]");
      if (card) {
        const cards = visibleFocusables(document).filter((el) =>
          el.matches?.("[data-dish-card]")
        );
        const i = cards.indexOf(card);
        if (i !== -1) {
          const next = forward
            ? cards[(i + 1) % cards.length]
            : cards[(i - 1 + cards.length) % cards.length];
          focusNext(next, e);
        }
        return;
      }

      const textLike = isTextLike(active);
      const isSelect = active.tagName === "SELECT";

      // ── 2. SEARCH BOX — ArrowDown jumps to first dish ─────
      if (textLike && active.type === "search" && key === "ArrowDown") {
        const firstCard = document.querySelector("[data-dish-card]");
        if (firstCard) {
          focusNext(firstCard, e);
          return;
        }
      }

      // Left/Right in a text field move the caret — never hijack.
      if (textLike && (key === "ArrowLeft" || key === "ArrowRight")) return;

      // Select uses arrows for its own options — never hijack.
      if (isSelect) return;

      // ── 3. INSIDE A FORM — cycle between fields only ──────
      const form = active.closest("form");
      const scope = form ?? document;
      const list = visibleFocusables(scope);

      if (list.length === 0) return;

      const idx = list.indexOf(active);
      if (idx === -1) {
        // Focused element isn't in the list — focus the first.
        focusNext(list[0], e);
        return;
      }

      const next = forward
        ? list[(idx + 1) % list.length]
        : list[(idx - 1 + list.length) % list.length];

      if (next && next !== active) {
        focusNext(next, e);
      }
    }

    // capture = true → runs before any element's own onKeyDown,
    // so nothing can preventDefault ahead of us.
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, []);

  return null;
}