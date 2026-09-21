import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ebooks } from "@/lib/data/ebooks";
import { getProductBySlugResolved, getRelatedProductsResolved } from "@/lib/server/contentText";
import { ProductDetailView } from "@/components/product/ProductDetailView";
import { getSectionConfig } from "@/lib/server/sectionOrder";
import { getLandingLockConfig } from "@/lib/server/landingLock";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return ebooks.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlugResolved(slug);
  return { title: product ? `${product.title} — GrowGear` : "ইবুক — GrowGear" };
}

export default async function EbookDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlugResolved(slug);
  if (!product || product.category !== "ebook") notFound();

  const { order, hidden } = getSectionConfig(product.slug);
  const isFullyLocked = getLandingLockConfig("ebook", product.slug).mode === "full";
  return (
    <ProductDetailView
      product={product}
      related={isFullyLocked ? [] : getRelatedProductsResolved(product)}
      sectionOrder={order}
      hiddenSections={hidden}
    />
  );
}
