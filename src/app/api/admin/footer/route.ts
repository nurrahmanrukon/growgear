import { NextRequest, NextResponse } from "next/server";
import { getFooterSettings, setFooterSettings, FooterSettings } from "@/lib/server/footerSettings";

export async function GET() {
  return NextResponse.json(getFooterSettings());
}

export async function PUT(req: NextRequest) {
  let body: Partial<FooterSettings>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "অবৈধ রিকোয়েস্ট" }, { status: 400 });
  }
  return NextResponse.json(setFooterSettings(body));
}
