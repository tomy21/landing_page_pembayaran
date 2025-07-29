import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { data } = await req.json();

    const payload = {
      data: data,
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_INQUIRY}/v1/parking/Partner/InquiryTariffREG`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error("API Signature Inquiry Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch signature inquiry" },
      { status: 500 }
    );
  }
}
