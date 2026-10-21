import { NextRequest, NextResponse } from "next/server";
import { getSiteTextSettings, setSiteTextSettings, SiteTextSettings } from "@/lib/server/siteTextSettings";

export async function GET() {
  return NextResponse.json(getSiteTextSettings());
}

export async function PUT(req: NextRequest) {
  let body: Partial<SiteTextSettings>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "অবৈধ রিকোয়েস্ট" }, { status: 400 });
  }
  return NextResponse.json(setSiteTextSettings(body));
}
