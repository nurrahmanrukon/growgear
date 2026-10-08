import { Metadata } from "next";
import { allProductsResolved } from "@/lib/server/contentText";
import { ProductListing } from "@/components/product/ProductListing";
import { getSegmentMeta } from "@/lib/data/segments";

export const metadata: Metadata = { title: "সার্চ ফলাফল — GrowGear" };
export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; badge?: string; segment?: string }>;
}) {
  const { q = "", badge, segment } = await searchParams;
  const query = q.trim().toLowerCase();
  const segmentMeta = segment ? getSegmentMeta(segment) : undefined;
  let results = allProductsResolved();
  if (query) {
    results = results.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.author?.toLowerCase().includes(query) ||
        p.shortDescription.toLowerCase().includes(query)
    );
  }
  if (segmentMeta) {
    results = results.filter((p) => p.segmentSlug === segmentMeta.slug);
  }

  return (
    <ProductListing
      title={segmentMeta ? segmentMeta.label : q ? `"${q}" এর জন্য সার্চ ফলাফল` : "সব প্রোডাক্ট"}
      description={`${results.length} টি প্রোডাক্ট পাওয়া গেছে`}
      products={results}
      initialBadge={badge}
    />
  );
}
