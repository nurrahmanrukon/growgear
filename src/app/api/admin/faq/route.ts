import { NextRequest, NextResponse } from "next/server";
import { getFaqSettings, setFaqSettings, FaqSettings } from "@/lib/server/faqSettings";

export async function GET() {
  return NextResponse.json(getFaqSettings());
}

export async function PUT(req: NextRequest) {
  let body: Partial<FaqSettings>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "অবৈধ রিকোয়েস্ট" }, { status: 400 });
  }
  return NextResponse.json(setFaqSettings(body));
}
