// src/app/api/notifikasi/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json(); // 👈 penting! parse manual

  console.log("✅ Notifikasi diterima:", body);

  return NextResponse.json({ message: "Notifikasi diterima" }, { status: 200 });
}

// Optional: to handle wrong methods
export function GET() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}
