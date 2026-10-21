import { NextRequest, NextResponse } from "next/server";
import { getCouponSettings, setCouponSettings, CouponSettings } from "@/lib/server/couponSettings";

export async function GET() {
  return NextResponse.json(getCouponSettings());
}

export async function PUT(req: NextRequest) {
  let body: Partial<CouponSettings>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "অবৈধ রিকোয়েস্ট" }, { status: 400 });
  }

  try {
    const updated = setCouponSettings(body);
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "সংরক্ষণ করা যায়নি" }, { status: 400 });
  }
}
