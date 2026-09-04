import { Metadata } from "next";
import { allProducts } from "@/lib/data/products";
import { ProductListing } from "@/components/product/ProductListing";

export const metadata: Metadata = { title: "সার্চ ফলাফল — GrowGear" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim().toLowerCase();
  const results = query
    ? allProducts.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.author?.toLowerCase().includes(query) ||
          p.shortDescription.toLowerCase().includes(query)
      )
    : allProducts;

  return (
    <ProductListing
      title={q ? `"${q}" এর জন্য সার্চ ফলাফল` : "সব প্রোডাক্ট"}
      description={`${results.length} টি প্রোডাক্ট পাওয়া গেছে`}
      products={results}
    />
  );
}
