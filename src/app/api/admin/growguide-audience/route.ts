import { NextRequest, NextResponse } from "next/server";
import {
  getGrowGuideAudienceSettings,
  setGrowGuideAudienceSettings,
  GrowGuideAudienceSettings,
} from "@/lib/server/growguideAudienceSettings";

export async function GET() {
  return NextResponse.json(getGrowGuideAudienceSettings());
}

export async function PUT(req: NextRequest) {
  let body: Partial<GrowGuideAudienceSettings>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "অবৈধ রিকোয়েস্ট" }, { status: 400 });
  }
  return NextResponse.json(setGrowGuideAudienceSettings(body));
}
