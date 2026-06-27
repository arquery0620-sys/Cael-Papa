import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const pw = req.nextUrl.searchParams.get("pw") || "";
  const correct = process.env.ALBUM_PASSWORD || "";
  return NextResponse.json({ ok: pw === correct });
}
