import { notFound } from "next/navigation";
import { Metadata } from "next";
import { gear } from "@/lib/data/gear";
import { getProductBySlugResolved, getRelatedProductsResolved } from "@/lib/server/contentText";
import { ProductDetailView } from "@/components/product/ProductDetailView";
import { getSectionConfig } from "@/lib/server/sectionOrder";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return gear.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlugResolved(slug);
  return { title: product ? `${product.title} — GrowGear` : "গিয়ার — GrowGear" };
}

export default async function GearDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlugResolved(slug);
  if (!product || product.category !== "gear") notFound();

  const { order, hidden } = getSectionConfig(product.slug);
  return (
    <ProductDetailView
      product={product}
      related={getRelatedProductsResolved(product)}
      sectionOrder={order}
      hiddenSections={hidden}
    />
  );
}
