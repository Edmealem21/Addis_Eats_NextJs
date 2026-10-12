// src/app/menu/[id]/opengraph-image.jsx
import { ImageResponse } from "next/og";
import { getDish } from "@/lib/dishes";
import { SITE_URL, SITE_NAME } from "@/lib/site";

export const runtime = "nodejs";
export const alt = "Dish from Addis Eats";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Fetch the dish photo from the public CDN and return a data URL.
// We can't use fs.readFile here — public/ files aren't copied into
// the serverless function bundle on Vercel.
async function fetchImageAsDataUrl(publicPath) {
  try {
    const url = `${SITE_URL}${publicPath}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      console.error("OG image fetch failed:", res.status, url);
      return null;
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    const mime = res.headers.get("content-type") ?? "image/jpeg";
    return `data:${mime};base64,${buffer.toString("base64")}`;
  } catch (err) {
    console.error("OG image fetch error:", err?.message);
    return null;
  }
}

export default async function Image({ params }) {
  const { id } = await params;
  const dish = await getDish(id);

  if (!dish) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#1c1917",
            color: "white",
            fontSize: 64,
            fontFamily: "sans-serif",
          }}
        >
          Dish not found
        </div>
      ),
      { ...size }
    );
  }

  const imageDataUrl = await fetchImageAsDataUrl(dish.image);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#1c1917",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            flex: 1,
            padding: "72px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              fontSize: 32,
              color: "#f59e0b",
              fontWeight: 700,
              letterSpacing: -0.5,
            }}
          >
            {SITE_NAME}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div
              style={{
                fontSize: 84,
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: -2,
              }}
            >
              {dish.name}
            </div>
            <div
              style={{
                fontSize: 30,
                color: "#a8a29e",
                lineHeight: 1.35,
                maxWidth: 520,
              }}
            >
              {dish.description}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <div style={{ fontSize: 40, fontWeight: 700, color: "#f59e0b" }}>
              {dish.price} ETB
            </div>
            <div style={{ fontSize: 22, color: "#78716c" }}>
              {dish.category}
            </div>
          </div>
        </div>

        {imageDataUrl && (
          <div
            style={{
              width: 520,
              height: "100%",
              display: "flex",
              background: "#292524",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageDataUrl}
              alt={dish.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        )}
      </div>
    ),
    { ...size }
  );
}