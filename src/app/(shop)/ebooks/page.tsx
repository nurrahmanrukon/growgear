import { Metadata } from "next";
import { ebooks } from "@/lib/data/ebooks";
import { categoryMeta } from "@/lib/data/products";
import { ProductListing } from "@/components/product/ProductListing";

export const metadata: Metadata = { title: "ইবুক — GrowGear" };

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
      products={ebooks}
      basePath="/ebooks"
      initialBadge={badge}
    />
  );
}
