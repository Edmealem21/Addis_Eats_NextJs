"use client";
import dynamic from "next/dynamic";

const DeliveryMap = dynamic(() => import("./DeliveryMap"), {
  ssr: false,
  loading: () => (
    <div
      style={{ height: 360 }}
      className="grid place-items-center rounded-lg border bg-stone-100 text-sm text-stone-500"
    >
      Loading map…
    </div>
  ),
});

export default function MapWrapper(props) {
  return <DeliveryMap {...props} />;
}