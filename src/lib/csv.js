// src/lib/csv.js

// Escape a single field for CSV:
//   - wrap in double quotes if it contains , " or \n
//   - double any internal "
function escapeField(value) {
  if (value == null) return "";
  const s = String(value);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

// toCsv([["a","b"],["c","d"]]) → "a,b\nc,d"
// toCsv([{a:1,b:2}], ["a","b"]) → "a,b\n1,2"
export function toCsv(rows, columns) {
  if (!rows || rows.length === 0) return "";

  // If columns given, extract from objects; otherwise assume arrays.
  let header;
  let body;

  if (columns) {
    header = columns;
    body = rows.map((r) => columns.map((c) => r[c]));
  } else if (Array.isArray(rows[0])) {
    header = null;
    body = rows;
  } else {
    header = Object.keys(rows[0]);
    body = rows.map((r) => header.map((c) => r[c]));
  }

  const lines = [];
  if (header) lines.push(header.map(escapeField).join(","));
  for (const row of body) lines.push(row.map(escapeField).join(","));
  return lines.join("\r\n"); // CRLF — Excel-friendly
}

// Trigger a browser download of a string as a file.
// Client-only — call from a click handler.
export function downloadCsv(filename, csv) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}