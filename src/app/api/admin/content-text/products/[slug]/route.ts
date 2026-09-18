import { NextRequest, NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/data/products";
import {
  ProductTextOverride,
  getProductOverride,
  isProductTextCustomized,
  resetProductOverride,
  resolveProduct,
  setProductOverride,
} from "@/lib/server/contentText";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) {
    return NextResponse.json({ error: "প্রোডাক্ট পাওয়া যায়নি" }, { status: 404 });
  }
  return NextResponse.json({
    current: resolveProduct(product),
    override: getProductOverride(slug),
    customized: isProductTextCustomized(slug),
  });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getProductBySlug(slug)) {
    return NextResponse.json({ error: "প্রোডাক্ট পাওয়া যায়নি" }, { status: 404 });
  }

  let body: ProductTextOverride;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "অবৈধ রিকোয়েস্ট" }, { status: 400 });
  }

  try {
    setProductOverride(slug, body);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "সংরক্ষণ করা যায়নি" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  resetProductOverride(slug);
  return NextResponse.json({ ok: true });
}
