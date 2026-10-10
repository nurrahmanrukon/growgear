import { NextRequest, NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/data/products";
import { handleMediaUpload, removeMediaFile, serveMediaFile } from "@/lib/server/mediaAssets";

function checkIsEbook(slug: string): NextResponse | null {
  const product = getProductBySlug(slug);
  if (!product || product.category !== "ebook") {
    return NextResponse.json({ error: "শুধু ইবুকের জন্য PDF আপলোড করা যাবে" }, { status: 400 });
  }
  return null;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const err = checkIsEbook(slug);
  if (err) return err;
  return serveMediaFile("ebook-pdf", slug, req);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const err = checkIsEbook(slug);
  if (err) return err;
  const result = await handleMediaUpload("ebook-pdf", slug, req);
  if (!result.ok) return result.response;
  return NextResponse.json(result.entry);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const err = checkIsEbook(slug);
  if (err) return err;
  removeMediaFile("ebook-pdf", slug);
  return NextResponse.json({ ok: true });
}
