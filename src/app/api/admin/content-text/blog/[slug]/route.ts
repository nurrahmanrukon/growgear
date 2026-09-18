import { NextRequest, NextResponse } from "next/server";
import { getBlogPostBySlug } from "@/lib/data/blog";
import {
  BlogTextOverride,
  getBlogOverride,
  isBlogTextCustomized,
  resetBlogOverride,
  resolveBlogPost,
  setBlogOverride,
} from "@/lib/server/contentText";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) {
    return NextResponse.json({ error: "পোস্ট পাওয়া যায়নি" }, { status: 404 });
  }
  return NextResponse.json({
    current: resolveBlogPost(post),
    override: getBlogOverride(slug),
    customized: isBlogTextCustomized(slug),
  });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getBlogPostBySlug(slug)) {
    return NextResponse.json({ error: "পোস্ট পাওয়া যায়নি" }, { status: 404 });
  }

  let body: BlogTextOverride;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "অবৈধ রিকোয়েস্ট" }, { status: 400 });
  }

  try {
    setBlogOverride(slug, body);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "সংরক্ষণ করা যায়নি" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  resetBlogOverride(slug);
  return NextResponse.json({ ok: true });
}
