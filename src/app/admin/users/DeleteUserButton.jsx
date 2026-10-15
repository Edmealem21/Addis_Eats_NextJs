// src/app/admin/users/DeleteUserButton.jsx
"use client";

import { deleteUserAction } from "../actions";

export default function DeleteUserButton({ id, name }) {
  return (
    <form
      action={deleteUserAction}
      onSubmit={(e) => {
        if (!confirm(`Delete user "${name}"? This cannot be undone.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        aria-label={`Delete ${name}`}
        className="grid h-9 w-9 place-items-center rounded-lg text-red-600 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
      >
        🗑️
      </button>
    </form>
  );
}