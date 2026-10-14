import { Metadata } from "next";
import { ebooksResolved } from "@/lib/server/contentText";
import { getCategoryIntro } from "@/lib/server/categoryIntro";
import { ProductListing } from "@/components/product/ProductListing";
import { CategoryHero } from "@/components/product/CategoryHero";

export const metadata: Metadata = { title: "ইবুক — GrowGear" };
export const dynamic = "force-dynamic";

export default async function EbooksPage({
  searchParams,
}: {
  searchParams: Promise<{ badge?: string }>;
}) {
  const { badge } = await searchParams;
  return (
    <>
      <CategoryHero intro={getCategoryIntro("ebook")} />
      <ProductListing products={ebooksResolved()} initialBadge={badge} />
    </>
  );
}
