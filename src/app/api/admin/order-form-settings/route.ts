import { NextRequest, NextResponse } from "next/server";
import { getOrderFormSettings, setOrderFormSettings, OrderFormSettings } from "@/lib/server/orderFormSettings";

export async function GET() {
  return NextResponse.json(getOrderFormSettings());
}

export async function PUT(req: NextRequest) {
  let body: Partial<OrderFormSettings>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "অবৈধ রিকোয়েস্ট" }, { status: 400 });
  }

  try {
    const updated = setOrderFormSettings(body);
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "সংরক্ষণ করা যায়নি" }, { status: 400 });
  }
}
