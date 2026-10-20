import { NextRequest, NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/data/products";
import { getPostImageUrl, getPosts, isCustomized, resetPosts, setPosts, SocialProofPost } from "@/lib/server/socialProofPosts";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getProductBySlug(slug)) {
    return NextResponse.json({ error: "প্রোডাক্ট পাওয়া যায়নি" }, { status: 404 });
  }
  const posts = getPosts(slug).map((post) => ({
    ...post,
    imageUrl: post.imageId ? getPostImageUrl(slug, post.imageId) || undefined : undefined,
  }));
  return NextResponse.json({ posts, customized: isCustomized(slug) });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getProductBySlug(slug)) {
    return NextResponse.json({ error: "প্রোডাক্ট পাওয়া যায়নি" }, { status: 404 });
  }

  let body: { posts?: SocialProofPost[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "অবৈধ রিকোয়েস্ট" }, { status: 400 });
  }

  if (!Array.isArray(body.posts)) {
    return NextResponse.json({ error: "posts একটি array হতে হবে" }, { status: 400 });
  }

  const sanitized: SocialProofPost[] = body.posts.map((p) => ({
    id: p.id,
    name: p.name,
    platform: p.platform,
    text: p.text,
    likes: p.likes,
    hoursAgo: p.hoursAgo,
    imageId: p.imageId,
  }));

  try {
    setPosts(slug, sanitized);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "সংরক্ষণ করা যায়নি" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getProductBySlug(slug)) {
    return NextResponse.json({ error: "প্রোডাক্ট পাওয়া যায়নি" }, { status: 404 });
  }
  resetPosts(slug);
  return NextResponse.json({ ok: true });
}
