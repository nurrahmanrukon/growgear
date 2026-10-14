import { Metadata } from "next";
import { booksResolved } from "@/lib/server/contentText";
import { getCategoryIntro } from "@/lib/server/categoryIntro";
import { ProductListing } from "@/components/product/ProductListing";
import { CategoryHero } from "@/components/product/CategoryHero";

export const metadata: Metadata = { title: "বই — GrowGear" };
export const dynamic = "force-dynamic";

export default async function BooksPage({
  searchParams,
}: {
  searchParams: Promise<{ badge?: string }>;
}) {
  const { badge } = await searchParams;
  return (
    <>
      <CategoryHero intro={getCategoryIntro("book")} />
      <ProductListing products={booksResolved()} initialBadge={badge} />
    </>
  );
}
