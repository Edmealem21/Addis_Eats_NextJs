// src/lib/format.js

// etb(320)             → "320 ETB"
// etb(1234)            → "1,234 ETB"
// etb(1234, {short:true}) → "1.2K ETB"
export function etb(amount, { short = false } = {}) {
  const n = Number(amount) || 0;

  if (short) {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M ETB`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K ETB`;
    return `${n} ETB`;
  }

  return `${n.toLocaleString("en-US")} ETB`;
}

// when("2026-10-11T14:30:00Z") → "Oct 11, 2026, 2:30 PM"
// Always UTC-based so server and client agree.
export function when(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const day = d.getUTCDate();
  const month = months[d.getUTCMonth()];
  const year = d.getUTCFullYear();
  const h24 = d.getUTCHours();
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const ampm = h24 < 12 ? "AM" : "PM";
  const min = String(d.getUTCMinutes()).padStart(2, "0");

  return `${month} ${day}, ${year}, ${h12}:${min} ${ampm}`;
}

// relative("2026-10-11T14:30:00Z", now) → "3 min ago"
// Caller passes `now` so server and client produce the same string.
export function relative(iso, now = Date.now()) {
  if (!iso) return "—";
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "—";

  const diffSec = Math.round((now - t) / 1000);
  const abs = Math.abs(diffSec);

  if (abs < 60) return diffSec >= 0 ? "just now" : "in a moment";
  const min = Math.round(diffSec / 60);
  if (Math.abs(min) < 60) return min >= 0 ? `${min} min ago` : `in ${-min} min`;
  const hr = Math.round(min / 60);
  if (Math.abs(hr) < 24) return hr >= 0 ? `${hr} hr ago` : `in ${-hr} hr`;
  const day = Math.round(hr / 24);
  return day >= 0 ? `${day} d ago` : `in ${-day} d`;
}