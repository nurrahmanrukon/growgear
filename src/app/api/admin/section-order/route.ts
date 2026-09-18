import { NextRequest, NextResponse } from "next/server";
import { SECTION_CATALOG, getSectionOrder, setSectionOrder } from "@/lib/server/sectionOrder";

export async function GET() {
  return NextResponse.json({ order: getSectionOrder(), catalog: SECTION_CATALOG });
}

export async function PUT(req: NextRequest) {
  let body: { order?: string[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "অবৈধ রিকোয়েস্ট" }, { status: 400 });
  }

  if (!Array.isArray(body.order)) {
    return NextResponse.json({ error: "অর্ডার লিস্ট দিতে হবে" }, { status: 400 });
  }

  try {
    setSectionOrder(body.order);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "আপডেট করা যায়নি" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
