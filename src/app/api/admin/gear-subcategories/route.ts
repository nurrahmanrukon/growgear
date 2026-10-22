import { NextRequest, NextResponse } from "next/server";
import {
  getGearSubcategorySettings,
  setGearSubcategorySettings,
  GearSubcategorySettings,
} from "@/lib/server/gearSubcategorySettings";

export async function GET() {
  return NextResponse.json(getGearSubcategorySettings());
}

export async function PUT(req: NextRequest) {
  let body: Partial<GearSubcategorySettings>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "অবৈধ রিকোয়েস্ট" }, { status: 400 });
  }
  return NextResponse.json(setGearSubcategorySettings(body));
}
