"use client";
import { useEffect, useState } from "react";
import MapWrapper from "./MapWrapper";
import TrackingPanel from "./TrackingPanel";

export default function TrackingView({
  orderId,
  initialStatus,
  restaurant,
  delivery,
  neighbourhood,
  address,
}) {
  const [status, setStatus] = useState(initialStatus ?? "pending");
  const [connection, setConnection] = useState("connecting");
  const [lastEventAt, setLastEventAt] = useState(null);
  const [now, setNow] = useState(() => Date.now());

  // Refresh the "X min ago" text every 30 seconds
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const es = new EventSource(`/api/orders/${orderId}/stream`);

    es.onopen = () => setConnection("open");

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === "status") {
          setStatus(data.status);
          setLastEventAt(data.at);
          setConnection("open");
          if (data.status === "delivered") {
            setConnection("closed");
            es.close();
          }
        }
      } catch {}
    };

    es.onerror = () => {
      if (es.readyState === EventSource.CLOSED) setConnection("error");
      else setConnection("connecting");
    };

    return () => es.close();
  }, [orderId]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <MapWrapper
        status={status}
        restaurant={restaurant}
        delivery={delivery}
        neighbourhood={neighbourhood}
      />

      <TrackingPanel
        status={status}
        connection={connection}
        lastEventAt={lastEventAt}
        now={now}
        restaurant={restaurant}
        delivery={delivery}
        address={address}
      />
    </div>
  );
}