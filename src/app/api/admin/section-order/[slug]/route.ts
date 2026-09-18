import { NextRequest, NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/data/products";
import { getSectionConfig, isCustomized, resetSectionOrder, setSectionConfig } from "@/lib/server/sectionOrder";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getProductBySlug(slug)) {
    return NextResponse.json({ error: "প্রোডাক্ট পাওয়া যায়নি" }, { status: 404 });
  }
  const config = getSectionConfig(slug);
  return NextResponse.json({ order: config.order, hidden: config.hidden, customized: isCustomized(slug) });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getProductBySlug(slug)) {
    return NextResponse.json({ error: "প্রোডাক্ট পাওয়া যায়নি" }, { status: 404 });
  }

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
    setSectionConfig(slug, { order: body.order, hidden: body.hidden });
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
