import { Metadata } from "next";
import { categoryMeta } from "@/lib/data/products";
import { booksResolved } from "@/lib/server/contentText";
import { ProductListing } from "@/components/product/ProductListing";

export const metadata: Metadata = { title: "বই — GrowGear" };
export const dynamic = "force-dynamic";

export default async function BooksPage({
  searchParams,
}: {
  searchParams: Promise<{ badge?: string }>;
}) {
  const { badge } = await searchParams;
  return (
    <ProductListing
      title={categoryMeta.book.label}
      description={categoryMeta.book.description}
      products={booksResolved()}
      basePath="/books"
      initialBadge={badge}
    />
  );
}
