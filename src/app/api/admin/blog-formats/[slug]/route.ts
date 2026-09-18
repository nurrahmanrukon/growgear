import { NextRequest, NextResponse } from "next/server";
import { getBlogPostBySlug } from "@/lib/data/blog";
import { getHiddenFormats, isFormatsCustomized, resetBlogFormats, setHiddenFormats } from "@/lib/server/blogFormats";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getBlogPostBySlug(slug)) {
    return NextResponse.json({ error: "পোস্ট পাওয়া যায়নি" }, { status: 404 });
  }
  return NextResponse.json({ hidden: getHiddenFormats(slug), customized: isFormatsCustomized(slug) });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getBlogPostBySlug(slug)) {
    return NextResponse.json({ error: "পোস্ট পাওয়া যায়নি" }, { status: 404 });
  }

  let body: { hidden?: string[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "অবৈধ রিকোয়েস্ট" }, { status: 400 });
  }

  if (!Array.isArray(body.hidden)) {
    return NextResponse.json({ error: "hidden একটি array হতে হবে" }, { status: 400 });
  }

  try {
    setHiddenFormats(slug, body.hidden);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "আপডেট করা যায়নি" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getBlogPostBySlug(slug)) {
    return NextResponse.json({ error: "পোস্ট পাওয়া যায়নি" }, { status: 404 });
  }
  resetBlogFormats(slug);
  return NextResponse.json({ ok: true });
}
