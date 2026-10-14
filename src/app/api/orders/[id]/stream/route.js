// src/app/api/orders/[id]/stream/route.js
import { getOrder } from "@/lib/orders";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const STATUS_FLOW = ["pending", "preparing", "out_for_delivery", "delivered"];

// Server-Sent Events endpoint. Frames look like:
//   data: <payload>\n\n
// The two newlines are mandatory. Missing them = no event.
export async function GET(req, { params }) {
  const { id } = await params;

  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const order = getOrder(id);
  if (!order || order.userId !== session.userId) {
    return new Response("Not found", { status: 404 });
  }

  const encoder = new TextEncoder();
  let closed = false;

  const stream = new ReadableStream({
    start(controller) {
      function send(event) {
        if (closed) return;
        const payload = `data: ${JSON.stringify(event)}\n\n`;
        try {
          controller.enqueue(encoder.encode(payload));
        } catch {
          closed = true;
        }
      }

      // Initial snapshot â€” the same shape every subsequent event uses.
      send({ type: "status", status: deriveStatus(order), at: new Date().toISOString() });

      // Simulated progress: advance every 4 seconds.
      let tick = 0;
      const interval = setInterval(() => {
        tick++;
        if (closed) { clearInterval(interval); return; }

        const status = deriveStatus(order, tick * 4);
        send({ type: "status", status, at: new Date().toISOString() });

        if (status === "delivered") {
          closed = true;
          clearInterval(interval);
          try { controller.close(); } catch {}
        }
      }, 4000);

      // Clean up if the client disconnects early.
      req.signal.addEventListener("abort", () => {
        closed = true;
        clearInterval(interval);
        try { controller.close(); } catch {}
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

function deriveStatus(order, extraSeconds = 0) {
  const ageSeconds =
    (Date.now() - new Date(order.createdAt).getTime()) / 1000 + extraSeconds;
  const step = Math.min(STATUS_FLOW.length - 1, Math.floor(ageSeconds / 10));
  return STATUS_FLOW[step];
}
