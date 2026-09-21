import { notFound } from "next/navigation";
import { Metadata } from "next";
import { books } from "@/lib/data/books";
import { getProductBySlugResolved, getRelatedProductsResolved } from "@/lib/server/contentText";
import { ProductDetailView } from "@/components/product/ProductDetailView";
import { getSectionConfig } from "@/lib/server/sectionOrder";
import { getLandingLockConfig } from "@/lib/server/landingLock";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return books.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlugResolved(slug);
  return { title: product ? `${product.title} — GrowGear` : "বই — GrowGear" };
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlugResolved(slug);
  if (!product || product.category !== "book") notFound();

  const { order, hidden } = getSectionConfig(product.slug);
  const isFullyLocked = getLandingLockConfig("book", product.slug).mode === "full";
  return (
    <ProductDetailView
      product={product}
      related={isFullyLocked ? [] : getRelatedProductsResolved(product)}
      sectionOrder={order}
      hiddenSections={hidden}
    />
  );
}
