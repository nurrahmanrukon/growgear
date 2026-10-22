import { NextRequest, NextResponse } from "next/server";
import {
  getGrowGuideFaqSettings,
  setGrowGuideFaqSettings,
  GrowGuideFaqSettings,
} from "@/lib/server/growguideFaqSettings";

export async function GET() {
  return NextResponse.json(getGrowGuideFaqSettings());
}

export async function PUT(req: NextRequest) {
  let body: Partial<GrowGuideFaqSettings>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "অবৈধ রিকোয়েস্ট" }, { status: 400 });
  }
  return NextResponse.json(setGrowGuideFaqSettings(body));
}
