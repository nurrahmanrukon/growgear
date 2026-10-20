import { NextRequest, NextResponse } from "next/server";
import {
  HOME_SECTION_CATALOG,
  getHomeSectionConfig,
  isHomeCustomized,
  resetHomeSectionOrder,
  setHomeSectionConfig,
} from "@/lib/server/homeSectionOrder";

export async function GET() {
  const config = getHomeSectionConfig();
  return NextResponse.json({
    catalog: HOME_SECTION_CATALOG,
    order: config.order,
    hidden: config.hidden,
    customized: isHomeCustomized(),
  });
}

export async function PUT(req: NextRequest) {
  let body: { order?: string[]; hidden?: string[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "অবৈধ রিকোয়েস্ট" }, { status: 400 });
  }

  if (!Array.isArray(body.order) || !Array.isArray(body.hidden)) {
    return NextResponse.json({ error: "অর্ডার ও হাইড লিস্ট দিতে হবে" }, { status: 400 });
  }

  try {
    setHomeSectionConfig({ order: body.order, hidden: body.hidden });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "আপডেট করা যায়নি" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  resetHomeSectionOrder();
  return NextResponse.json({ ok: true });
}
