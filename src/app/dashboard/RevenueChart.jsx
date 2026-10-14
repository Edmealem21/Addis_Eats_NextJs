// src/app/dashboard/RevenueChart.jsx
"use client";

const CHART_HEIGHT = 240;
const CHART_WIDTH = 640;
const PADDING = { top: 16, right: 16, bottom: 48, left: 72 };

export default function RevenueChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <p className="rounded border border-dashed bg-stone-50 p-6 text-center text-sm text-stone-500">
        No revenue data yet.
      </p>
    );
  }

  const innerW = CHART_WIDTH - PADDING.left - PADDING.right;
  const innerH = CHART_HEIGHT - PADDING.top - PADDING.bottom;
  const maxValue = Math.max(...data.map((d) => d.revenue), 1);
  const barGap = 8;
  const barW = (innerW - barGap * (data.length - 1)) / data.length;

  // Nice round ticks up to maxValue
  const ticks = niceTicks(maxValue, 4);

  return (
    <div
      style={{ height: CHART_HEIGHT }}
      className="rounded-lg border bg-white p-4"
    >
      <svg
        role="img"
        aria-label={`Bar chart: revenue by neighbourhood. Highest is ${data[0].neighbourhood} at ${data[0].revenue} ETB.`}
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        className="h-full w-full"
      >
        {/* Y-axis grid + labels */}
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
                {t.toLocaleString("en-US")}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const h = (d.revenue / maxValue) * innerH;
          const x = PADDING.left + i * (barW + barGap);
          const y = PADDING.top + innerH - h;
          return (
            <g key={d.neighbourhood}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={h}
                fill="#d97706"
                rx={3}
              >
                <title>
                  {d.neighbourhood}: {d.revenue.toLocaleString("en-US")} ETB
                </title>
              </rect>
              <text
                x={x + barW / 2}
                y={CHART_HEIGHT - PADDING.bottom + 18}
                textAnchor="middle"
                fontSize={10}
                fill="#57534e"
              >
                {d.neighbourhood.length > 8
                  ? d.neighbourhood.slice(0, 7) + "…"
                  : d.neighbourhood}
              </text>
            </g>
          );
        })}

        {/* Y-axis label */}
        <text
          x={16}
          y={PADDING.top + innerH / 2}
          transform={`rotate(-90 16 ${PADDING.top + innerH / 2})`}
          textAnchor="middle"
          fontSize={11}
          fill="#78716c"
        >
          ETB
        </text>
      </svg>
    </div>
  );
}

function niceTicks(max, count) {
  const rough = max / count;
  const mag = Math.pow(10, Math.floor(Math.log10(rough)));
  const norm = rough / mag;
  let step;
  if (norm <= 1) step = 1;
  else if (norm <= 2) step = 2;
  else if (norm <= 5) step = 5;
  else step = 10;
  step *= mag;

  const ticks = [];
  for (let v = 0; v <= max + step; v += step) {
    if (v <= max * 1.05) ticks.push(v);
  }
  return ticks;
}