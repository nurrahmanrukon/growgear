import { NextRequest, NextResponse } from "next/server";
import {
  getPurchaseToastSettings,
  setPurchaseToastSettings,
  PurchaseToastSettings,
} from "@/lib/server/purchaseToastSettings";

export async function GET() {
  return NextResponse.json(getPurchaseToastSettings());
}

export async function PUT(req: NextRequest) {
  let body: Partial<PurchaseToastSettings>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "অবৈধ রিকোয়েস্ট" }, { status: 400 });
  }
  return NextResponse.json(setPurchaseToastSettings(body));
}
