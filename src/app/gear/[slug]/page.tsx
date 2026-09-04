import { notFound } from "next/navigation";
import { Metadata } from "next";
import { gear } from "@/lib/data/gear";
import { getProductBySlug, getRelatedProducts } from "@/lib/data/products";
import { ProductDetailView } from "@/components/product/ProductDetailView";

export function generateStaticParams() {
  return gear.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  return { title: product ? `${product.title} — GrowGear` : "গিয়ার — GrowGear" };
}

export default async function GearDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product || product.category !== "gear") notFound();

  return <ProductDetailView product={product} related={getRelatedProducts(product)} />;
}
