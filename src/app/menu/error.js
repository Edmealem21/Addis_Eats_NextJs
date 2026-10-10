// src/app/menu/error.js
"use client";
export default function Error({ error, reset }) {
  return (
    <section className="space-y-4 rounded border border-red-300 bg-red-50 p-6">
      <h2 className="text-xl font-bold text-red-800">Menu failed to load</h2>
      <p className="text-red-700">{error.message}</p>
      <button onClick={() => reset()} className="rounded bg-red-700 px-4 py-2 text-white">
        Try again
      </button>
    </section>
  );
}