// src/app/opengraph-image.jsx
import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_DESCRIPTION, SITE_HOST } from "@/lib/site";

export const alt = `${SITE_NAME} — Authentic Ethiopian Food`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b91c1c 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 32, opacity: 0.9 }}>
          <span>🍽️</span>
          <span>Bole · Addis Ababa</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 96, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
            {SITE_NAME}
          </div>
          <div style={{ fontSize: 36, opacity: 0.92, lineHeight: 1.3, maxWidth: 900 }}>
            {SITE_DESCRIPTION}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, opacity: 0.85 }}>
          <span>injera · tibs · shiro · doro wat</span>
          <span>{SITE_HOST}</span>
        </div>
      </div>
    ),
    { ...size }
  );
}