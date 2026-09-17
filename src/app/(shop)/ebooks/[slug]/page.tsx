import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ebooks } from "@/lib/data/ebooks";
import { getProductBySlug, getRelatedProducts } from "@/lib/data/products";
import { ProductDetailView } from "@/components/product/ProductDetailView";

export function generateStaticParams() {
  return ebooks.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  return { title: product ? `${product.title} — GrowGear` : "ইবুক — GrowGear" };
}

export default async function EbookDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product || product.category !== "ebook") notFound();

  return <ProductDetailView product={product} related={getRelatedProducts(product)} />;
}
