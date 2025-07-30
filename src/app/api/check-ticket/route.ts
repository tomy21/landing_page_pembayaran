// Next.js App Router API Route
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const P1 = searchParams.get("P1");
  const P2 = searchParams.get("P2");

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const interval = setInterval(async () => {
        const res = await fetch(
          "https://integrationparkingservice.skyparking.online/v1/parking/Partner/CheckInquiryQRIS",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ P1, P2 }),
          }
        );

        const result = await res.json();
        const status = result?.data?.paymentStatus;

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(result)}\n\n`)
        );

        if (status === "PAID" || status === "FAILED") {
          clearInterval(interval);
          controller.close();
        }
      }, 2000);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
