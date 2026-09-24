import { NextRequest, NextResponse } from "next/server";
import { getWhatsAppSettings, setWhatsAppSettings } from "@/lib/server/whatsappSettings";

export async function GET() {
  return NextResponse.json(getWhatsAppSettings());
}

export async function PUT(req: NextRequest) {
  let body: { enabled?: boolean; number?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "অবৈধ রিকোয়েস্ট" }, { status: 400 });
  }

  try {
    const updated = setWhatsAppSettings(body);
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "আপডেট করা যায়নি" }, { status: 400 });
  }
}
