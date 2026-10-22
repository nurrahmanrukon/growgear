import { NextRequest, NextResponse } from "next/server";
import {
  getGrowGuidePageSettings,
  setGrowGuidePageSettings,
  GrowGuidePageSettings,
} from "@/lib/server/growguidePageSettings";

export async function GET() {
  return NextResponse.json(getGrowGuidePageSettings());
}

export async function PUT(req: NextRequest) {
  let body: Partial<GrowGuidePageSettings>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "অবৈধ রিকোয়েস্ট" }, { status: 400 });
  }
  return NextResponse.json(setGrowGuidePageSettings(body));
}
