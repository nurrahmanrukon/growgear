import { NextResponse } from "next/server";
import { allProducts } from "@/lib/data/products";
import { SECTION_CATALOG, isCustomized } from "@/lib/server/sectionOrder";

export async function GET() {
  const products = allProducts.map((p) => ({
    slug: p.slug,
    title: p.title,
    category: p.category,
    customized: isCustomized(p.slug),
  }));
  return NextResponse.json({ catalog: SECTION_CATALOG, products });
}
