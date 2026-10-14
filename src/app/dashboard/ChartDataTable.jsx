// src/app/dashboard/ChartDataTable.jsx
export default function ChartDataTable({ caption, columns, rows }) {
  return (
    <details className="rounded-lg border bg-white">
      <summary className="cursor-pointer p-3 text-sm text-stone-600 hover:bg-stone-50">
        View as table
      </summary>
      <div className="border-t p-3">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-b">
              {columns.map((c) => (
                <th key={c} scope="col" className="py-2 pr-4 font-medium text-stone-700">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b last:border-b-0">
                {row.map((cell, j) => (
                  <td key={j} className="py-2 pr-4 text-stone-700">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}