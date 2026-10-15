import { NextRequest, NextResponse } from "next/server";
import { CrossSellSettings, getCrossSellSettings, setCrossSellSettings } from "@/lib/server/crossSellSettings";
import { allProductsResolved } from "@/lib/server/contentText";

export async function GET() {
  const all = allProductsResolved();
  const toOption = (p: { slug: string; title: string }) => ({ slug: p.slug, title: p.title });
  const ebooks = all.filter((p) => p.category === "ebook").map(toOption);
  const books = all.filter((p) => p.category === "book").map(toOption);
  const gear = all.filter((p) => p.category === "gear").map(toOption);
  return NextResponse.json({ settings: getCrossSellSettings(), ebooks, books, gear });
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
