import { NextRequest, NextResponse } from "next/server";
import { getBlogPostBySlug } from "@/lib/data/blog";
import { handleMediaUpload, removeMediaFile } from "@/lib/server/mediaAssets";

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await handleMediaUpload("blog-image", slug, req);
  if (!result.ok) return result.response;
  return NextResponse.json(result.entry);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getBlogPostBySlug(slug)) {
    return NextResponse.json({ error: "পোস্ট পাওয়া যায়নি" }, { status: 404 });
  }
  removeMediaFile("blog-image", slug);
  return NextResponse.json({ ok: true });
}
