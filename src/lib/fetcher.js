// src/lib/fetcher.js
export default async function fetcher(url) {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    const err = new Error(`Request failed: ${res.status} ${res.statusText}`);
    err.status = res.status;
    try { err.info = await res.json(); } catch {}
    throw err;
  }
  return res.json();
}