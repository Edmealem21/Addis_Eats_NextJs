// src/app/menu/SearchBox.jsx
"use client";
import { useEffect, useState } from "react";

export default function SearchBox({
  onDebouncedChange,
  delay = 300,
  placeholder = "Search dishes…",
}) {
  const [value, setValue] = useState("");

  useEffect(() => {
    const t = setTimeout(() => onDebouncedChange(value.trim()), delay);
    return () => clearTimeout(t);
  }, [value, delay, onDebouncedChange]);

  return (
    <input
      type="search"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded border border-stone-300 bg-white px-3 py-2"
    />
  );
}