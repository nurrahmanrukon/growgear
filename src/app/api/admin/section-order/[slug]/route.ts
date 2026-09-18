import { NextRequest, NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/data/products";
import { getSectionOrder, isCustomized, resetSectionOrder, setSectionOrder } from "@/lib/server/sectionOrder";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getProductBySlug(slug)) {
    return NextResponse.json({ error: "প্রোডাক্ট পাওয়া যায়নি" }, { status: 404 });
  }
  return NextResponse.json({ order: getSectionOrder(slug), customized: isCustomized(slug) });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getProductBySlug(slug)) {
    return NextResponse.json({ error: "প্রোডাক্ট পাওয়া যায়নি" }, { status: 404 });
  }

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
    setSectionOrder(slug, body.order);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "আপডেট করা যায়নি" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getProductBySlug(slug)) {
    return NextResponse.json({ error: "প্রোডাক্ট পাওয়া যায়নি" }, { status: 404 });
  }
  resetSectionOrder(slug);
  return NextResponse.json({ ok: true });
}
