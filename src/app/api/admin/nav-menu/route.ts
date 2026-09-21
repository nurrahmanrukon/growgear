import { NextRequest, NextResponse } from "next/server";
import { getAllNavMenuEntries, resetNavMenu, setNavMenuOrder } from "@/lib/server/navMenu";

export async function GET() {
  return NextResponse.json({ items: getAllNavMenuEntries() });
}

export async function PUT(req: NextRequest) {
  let body: { order?: string[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "অবৈধ রিকোয়েস্ট" }, { status: 400 });
  }

  if (!Array.isArray(body.order)) {
    return NextResponse.json({ error: "order একটি array হতে হবে" }, { status: 400 });
  }

  try {
    setNavMenuOrder(body.order);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "আপডেট করা যায়নি" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  resetNavMenu();
  return NextResponse.json({ ok: true });
}
