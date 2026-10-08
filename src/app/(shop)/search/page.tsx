import { Metadata } from "next";
import { allProductsResolved } from "@/lib/server/contentText";
import { ProductListing } from "@/components/product/ProductListing";
import { getSegmentMeta, getSegmentTopicSlug } from "@/lib/data/segments";
import { TOPICS } from "@/lib/data/blog";

export const metadata: Metadata = { title: "সার্চ ফলাফল — GrowGear" };
export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; badge?: string; segment?: string; topic?: string }>;
}) {
  const { q = "", badge, segment, topic } = await searchParams;
  const query = q.trim().toLowerCase();
  const segmentMeta = segment ? getSegmentMeta(segment) : undefined;
  const topicMeta = !segmentMeta && topic ? TOPICS.find((t) => t.slug === topic) : undefined;
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
  } else if (topicMeta) {
    results = results.filter((p) => p.segmentSlug && getSegmentTopicSlug(p.segmentSlug) === topicMeta.slug);
  }

  return (
    <ProductListing
      title={segmentMeta ? segmentMeta.label : topicMeta ? topicMeta.label : q ? `"${q}" এর জন্য সার্চ ফলাফল` : "সব প্রোডাক্ট"}
      description={`${results.length} টি প্রোডাক্ট পাওয়া গেছে`}
      products={results}
      initialBadge={badge}
    />
  );
}
