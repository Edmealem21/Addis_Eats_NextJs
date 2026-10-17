import { getOrder } from "@/lib/orders";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const STATUS_FLOW = ["pending", "preparing", "out_for_delivery", "delivered"];

export async function GET(req, { params }) {
  const { id } = await params;

  // 1. Check session
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  // 2. THE CRITICAL FIX: You must await this because it's querying Vercel KV
  const order = await getOrder(id);
  
  // 3. Ownership check
  if (!order || order.userId !== session.userId) {
    return new Response("Not found", { status: 404 });
  }

  const encoder = new TextEncoder();
  let closed = false;

  const stream = new ReadableStream({
    start(controller) {
      function send(event) {
        if (closed) return;
        try {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(event)}\n\n`)
          );
        } catch {
          closed = true;
        }
      }

      // Flush buffer
      try {
        controller.enqueue(encoder.encode(": connected\n\n"));
      } catch {}

      send({
        type: "status",
        status: deriveStatus(order),
        at: new Date().toISOString(),
      });

      let tick = 0;
      const interval = setInterval(() => {
        tick++;
        if (closed) {
          clearInterval(interval);
          return;
        }
        const status = deriveStatus(order, tick * 4);
        send({ type: "status", status, at: new Date().toISOString() });
        
        if (status === "delivered") {
          closed = true;
          clearInterval(interval);
          try {
            controller.close();
          } catch {}
        }
      }, 4000);

      req.signal.addEventListener("abort", () => {
        closed = true;
        clearInterval(interval);
        try {
          controller.close();
        } catch {}
      });
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
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