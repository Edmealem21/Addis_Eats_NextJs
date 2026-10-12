// src/app/menu/[id]/opengraph-image.jsx
import { ImageResponse } from "next/og";
import fs from "fs/promises";
import path from "path";
import { getDish } from "@/lib/dishes";
import { SITE_NAME } from "@/lib/site";

// Force the Node runtime — `fs` is not available on the Edge runtime.
export const runtime = "nodejs";

export const alt = "Dish from Addis Eats";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Read the dish photo from /public and return it as a base64 data URL.
// Doing this instead of fetching the image over HTTP avoids the
// "self-fetch times out on cold start" failure you saw on Vercel.
async function loadImageAsDataUrl(publicPath) {
  try {
    // publicPath is like "/dishes/kitfo.jpg". Strip the leading "/"
    // and join it to <project>/public.
    const relative = publicPath.replace(/^\/+/, "");
    const filePath = path.join(process.cwd(), "public", relative);
    const buffer = await fs.readFile(filePath);

    const ext = path.extname(filePath).toLowerCase();
    const mime =
      ext === ".png"  ? "image/png"  :
      ext === ".webp" ? "image/webp" :
      ext === ".avif" ? "image/avif" :
      ext === ".gif"  ? "image/gif"  :
                        "image/jpeg";

    return `data:${mime};base64,${buffer.toString("base64")}`;
  } catch (err) {
    // File not found — the card will render without a photo.
    console.error("OG image: could not read", publicPath, err?.message);
    return null;
  }
}

export default async function Image({ params }) {
  const { id } = await params;
  const dish = await getDish(id);

  // Fallback card when the dish id doesn't exist.
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

  // Load the dish photo from disk → base64 data URL. No network.
  const imageDataUrl = await loadImageAsDataUrl(dish.image);

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
        {/* ── Left side: text ── */}
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

        {/* ── Right side: dish photo ── */}
        {imageDataUrl ? (
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
              width={520}
              height={630}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        ) : (
          // No photo available — show a placeholder block with the
          // dish name so the card still looks intentional.
          <div
            style={{
              width: 520,
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#292524",
              color: "#78716c",
              fontSize: 28,
            }}
          >
            {dish.category}
          </div>
        )}
      </div>
    ),
    { ...size }
  );
}