import { notFound } from "next/navigation";
import { Metadata } from "next";
import { books } from "@/lib/data/books";
import { getProductBySlug, getRelatedProducts } from "@/lib/data/products";
import { ProductDetailView } from "@/components/product/ProductDetailView";

export function generateStaticParams() {
  return books.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  return { title: product ? `${product.title} — GrowGear` : "বই — GrowGear" };
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product || product.category !== "book") notFound();

  return <ProductDetailView product={product} related={getRelatedProducts(product)} />;
}
