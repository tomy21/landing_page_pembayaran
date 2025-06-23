import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { storeID, transactionNo } = await req.json();
    console.log(process.env.NEXT_PUBLIC_URL_DEV_GENERATE_SIGNATURE);
    const payload = {
      login: "SKY_TOMY-SOEHARTO",
      password: "c43cba3b7b7d5c319a3f284a5d8188ac",
      storeID,
      transactionNo,
    };
    console.log("", payload);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_DEV_GENERATE_SIGNATURE}/v1/parking/Signature-Inquiry`,
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
