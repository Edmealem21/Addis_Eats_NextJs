// src/app/dashboard/OrdersLineChart.jsx
"use client";

const CHART_HEIGHT = 240;
const CHART_WIDTH = 640;
const PADDING = { top: 16, right: 16, bottom: 48, left: 56 };

export default function OrdersLineChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <p className="rounded border border-dashed bg-stone-50 p-6 text-center text-sm text-stone-500">
        No order data yet.
      </p>
    );
  }

  const innerW = CHART_WIDTH - PADDING.left - PADDING.right;
  const innerH = CHART_HEIGHT - PADDING.top - PADDING.bottom;
  const maxValue = Math.max(...data.map((d) => d.count), 1);

  const stepX = innerW / Math.max(1, data.length - 1);
  const points = data.map((d, i) => ({
    x: PADDING.left + i * stepX,
    y: PADDING.top + innerH - (d.count / maxValue) * innerH,
    ...d,
  }));

  const linePath = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");

  // Y ticks
  const tickStep = Math.max(1, Math.ceil(maxValue / 4));
  const ticks = [];
  for (let v = 0; v <= maxValue; v += tickStep) ticks.push(v);

  return (
    <div
      style={{ height: CHART_HEIGHT }}
      className="rounded-lg border bg-white p-4"
    >
      <svg
        role="img"
        aria-label={`Line chart: orders per day for the last ${data.length} days. Range ${data[0].date} to ${data[data.length - 1].date}.`}
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        className="h-full w-full"
      >
        {/* Y grid + labels */}
        {ticks.map((t) => {
          const y = PADDING.top + innerH - (t / maxValue) * innerH;
          return (
            <g key={t}>
              <line
                x1={PADDING.left}
                x2={PADDING.left + innerW}
                y1={y}
                y2={y}
                stroke="#e7e5e4"
                strokeWidth={1}
              />
              <text
                x={PADDING.left - 8}
                y={y + 4}
                textAnchor="end"
                fontSize={11}
                fill="#78716c"
              >
                {t}
              </text>
            </g>
          );
        })}

        {/* Line */}
        <path d={linePath} fill="none" stroke="#0369a1" strokeWidth={2} />

        {/* Points */}
        {points.map((p) => (
          <g key={p.date}>
            <circle cx={p.x} cy={p.y} r={3} fill="#0369a1">
              <title>
                {p.date}: {p.count} orders
              </title>
            </circle>
            {/* Date label every 3rd point */}
          </g>
        ))}

        {/* X labels — every 3rd date */}
        {points.map((p, i) =>
          i % 3 === 0 ? (
            <text
              key={`x-${p.date}`}
              x={p.x}
              y={CHART_HEIGHT - PADDING.bottom + 18}
              textAnchor="middle"
              fontSize={10}
              fill="#57534e"
            >
              {p.date.slice(5)}
            </text>
          ) : null
        )}

        {/* Y-axis label */}
        <text
          x={16}
          y={PADDING.top + innerH / 2}
          transform={`rotate(-90 16 ${PADDING.top + innerH / 2})`}
          textAnchor="middle"
          fontSize={11}
          fill="#78716c"
        >
          orders
        </text>
      </svg>
    </div>
  );
}