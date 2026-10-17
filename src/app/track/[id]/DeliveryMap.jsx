"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// How far along the route the car is, per status.
// pending → at the restaurant. delivered → at the address.
const STATUS_PROGRESS = {
  pending: 0,
  preparing: 0.08,
  out_for_delivery: 0.65,
  delivered: 1,
};

// Linear interpolation between two [lat, lng] pairs.
function lerp(a, b, t) {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

// Fits the map to show both endpoints.
function FitBounds({ a, b }) {
  const map = useMap();
  useEffect(() => {
    if (a && b) map.fitBounds([a, b], { padding: [40, 40], maxZoom: 14 });
  }, [a, b, map]);
  return null;
}

export default function DeliveryMap({
  status,
  restaurant,
  delivery,
  neighbourhood,
}) {
  const [icons, setIcons] = useState(null);
  const [carPos, setCarPos] = useState(restaurant);

  // Load Leaflet icons on the client only.
  useEffect(() => {
    let alive = true;
    import("leaflet").then((L) => {
      if (!alive) return;
      setIcons({
        car: L.divIcon({
          className: "",
          html: `<div style="
            width:40px;height:40px;
            display:grid;place-items:center;
            font-size:24px;
            background:white;
            border-radius:50%;
            box-shadow:0 2px 10px rgba(0,0,0,0.35);
            border:3px solid #f59e0b;
          ">🚗</div>`,
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        }),
        delivery: L.divIcon({
          className: "",
          html: `<div style="
            width:24px;height:24px;
            border-radius:50%;
            background:#dc2626;
            border:3px solid white;
            box-shadow:0 0 0 2px #dc2626, 0 2px 6px rgba(0,0,0,0.3);
          "></div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        }),
      });
    });
    return () => {
      alive = false;
    };
  }, []);

  // Smoothly animate the car toward its target.
  useEffect(() => {
    const progress = STATUS_PROGRESS[status] ?? 0;
    const target = lerp(restaurant, delivery, progress);

    const timer = setInterval(() => {
      setCarPos((prev) => {
        const dx = target[0] - prev[0];
        const dy = target[1] - prev[1];
        const dist = Math.hypot(dx, dy);
        if (dist < 0.00008) {
          clearInterval(timer);
          return target;
        }
        // Move 12% of remaining distance per tick — an easing-like approach.
        return [prev[0] + dx * 0.12, prev[1] + dy * 0.12];
      });
    }, 70);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  if (!icons) {
    return (
      <div style={{ height: 450 }} className="overflow-hidden rounded-lg border bg-stone-100">
        Loading map…
      </div>
    );
  }

  return (
    <div>
      <div
        style={{ height: 360 }}
        className="overflow-hidden rounded-lg border bg-stone-100"
      >
        <MapContainer
          center={delivery}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <Marker position={delivery} icon={icons.delivery}>
            <Popup>Delivery · {neighbourhood}</Popup>
          </Marker>

          <Marker position={carPos} icon={icons.car}>
            <Popup>Courier · {status}</Popup>
          </Marker>

          <FitBounds a={restaurant} b={delivery} />
        </MapContainer>
      </div>

      <p className="mt-2 text-xs text-stone-500">
        Map data © OpenStreetMap contributors
      </p>
    </div>
  );
}