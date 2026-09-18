import { NextRequest, NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/data/products";
import { handleMediaUpload, removeMediaFile } from "@/lib/server/mediaAssets";

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await handleMediaUpload("product-video", slug, req);
  if (!result.ok) return result.response;
  return NextResponse.json(result.entry);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getProductBySlug(slug)) {
    return NextResponse.json({ error: "প্রোডাক্ট পাওয়া যায়নি" }, { status: 404 });
  }
  removeMediaFile("product-video", slug);
  return NextResponse.json({ ok: true });
}
