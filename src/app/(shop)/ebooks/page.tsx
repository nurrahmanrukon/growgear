import { Metadata } from "next";
import { categoryMeta } from "@/lib/data/products";
import { ebooksResolved } from "@/lib/server/contentText";
import { ProductListing } from "@/components/product/ProductListing";

export const metadata: Metadata = { title: "ইবুক — GrowGear" };
export const dynamic = "force-dynamic";

export default async function EbooksPage({
  searchParams,
}: {
  searchParams: Promise<{ badge?: string }>;
}) {
  const { badge } = await searchParams;
  return (
    <ProductListing
      title={categoryMeta.ebook.label}
      description={categoryMeta.ebook.description}
      products={ebooksResolved()}
      basePath="/ebooks"
      initialBadge={badge}
    />
  );
}
