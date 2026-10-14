"use client";

export default function Error({ error, reset }) {
  return (
    <section
      className="space-y-4 rounded-lg border border-red-300 bg-red-50 p-6"
      role="alert"
    >
      <h2 className="text-xl font-bold text-red-800">Dashboard failed to load</h2>
      <p className="text-red-700">{error.message}</p>
      <button
        type="button"
        onClick={() => reset()}
        className="min-h-[44px] rounded bg-red-700 px-4 py-2 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
      >
        Try again
      </button>
    </section>
  );
}