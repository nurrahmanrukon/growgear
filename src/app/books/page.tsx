import { Metadata } from "next";
import { books } from "@/lib/data/books";
import { categoryMeta } from "@/lib/data/products";
import { ProductListing } from "@/components/product/ProductListing";

export const metadata: Metadata = { title: "বই — GrowGear" };

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
      products={books}
      basePath="/books"
      initialBadge={badge}
    />
  );
}
