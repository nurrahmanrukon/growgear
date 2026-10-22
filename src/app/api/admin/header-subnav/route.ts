import { NextRequest, NextResponse } from "next/server";
import { getHeaderSubNavSettings, setHeaderSubNavSettings, HeaderSubNavSettings } from "@/lib/server/headerSubNavSettings";

export async function GET() {
  return NextResponse.json(getHeaderSubNavSettings());
}

export async function PUT(req: NextRequest) {
  let body: Partial<HeaderSubNavSettings>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "অবৈধ রিকোয়েস্ট" }, { status: 400 });
  }
  return NextResponse.json(setHeaderSubNavSettings(body));
}
