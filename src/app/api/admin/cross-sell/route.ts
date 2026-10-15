import { NextRequest, NextResponse } from "next/server";
import { CrossSellSettings, getCrossSellSettings, setCrossSellSettings } from "@/lib/server/crossSellSettings";
import { allProductsResolved } from "@/lib/server/contentText";
import { blogPosts } from "@/lib/data/blog";

export async function GET() {
  const ebooks = allProductsResolved()
    .filter((p) => p.category === "ebook")
    .map((p) => ({ slug: p.slug, title: p.title }));
  const blog = blogPosts.map((p) => ({ slug: p.slug, title: p.title }));
  return NextResponse.json({ settings: getCrossSellSettings(), ebooks, blog });
}

export async function PUT(req: NextRequest) {
  let body: Partial<CrossSellSettings>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "অবৈধ রিকোয়েস্ট" }, { status: 400 });
  }

  const updated = setCrossSellSettings(body);
  return NextResponse.json(updated);
}
