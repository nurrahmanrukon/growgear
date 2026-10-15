import { NextRequest, NextResponse } from "next/server";
import { getCrossSellSettings, setCrossSellSettings } from "@/lib/server/crossSellSettings";
import { allProductsResolved } from "@/lib/server/contentText";

export async function GET() {
  const ebooks = allProductsResolved()
    .filter((p) => p.category === "ebook")
    .map((p) => ({ slug: p.slug, title: p.title }));
  return NextResponse.json({ settings: getCrossSellSettings(), ebooks });
}

export async function PUT(req: NextRequest) {
  let body: { enabled?: boolean; ebookSlug?: string; soldCount?: number; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "অবৈধ রিকোয়েস্ট" }, { status: 400 });
  }

  const updated = setCrossSellSettings(body);
  return NextResponse.json(updated);
}
