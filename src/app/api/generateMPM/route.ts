// src/app/api/generate-mpm/route.ts
import { NextRequest, NextResponse } from "next/server";

interface Payload {
  product: string;
  amount: {
    value: string;
    currency: string;
  };
  externalStoreId: string;
  additionalInfo: {
    qrType: string;
  };
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();

    const data: Payload = body.data;

    if (!data) {
      return NextResponse.json(
        { error: "Missing `data` in request body" },
        { status: 400 }
      );
    }

    const url = process.env.NEXT_PUBLIC_URL_GENERATE_MPM;

    if (!url) {
      return NextResponse.json(
        { error: "Missing env: NEXT_PUBLIC_URL_GENERATE_MPM" },
        { status: 500 }
      );
    }

    const response = await fetch(`${url}/v1/payment/qris/mpm/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // 🛠️ kirim langsung objek `data`
    });

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("API Generate MPM Error:", error.message || error);
    return NextResponse.json(
      { error: "Failed to generate MPM QRIS" },
      { status: 500 }
    );
  }
}
