import { Metadata } from "next";
import { GEAR_SUBCATEGORIES } from "@/lib/data/gear";
import { gearResolved } from "@/lib/server/contentText";
import { getCategoryIntro } from "@/lib/server/categoryIntro";
import { ProductListing } from "@/components/product/ProductListing";
import { CategoryHero } from "@/components/product/CategoryHero";

export const metadata: Metadata = { title: "গিয়ার — GrowGear" };
export const dynamic = "force-dynamic";

export default async function GearPage({
  searchParams,
}: {
  searchParams: Promise<{ badge?: string; category?: string }>;
}) {
  const { badge, category } = await searchParams;
  const subcategory = GEAR_SUBCATEGORIES.find((c) => c.slug === category);
  return (
    <>
      <CategoryHero intro={getCategoryIntro("gear")} />
      <ProductListing products={gearResolved()} initialBadge={badge} initialSubcategory={subcategory?.slug} />
    </>
  );
}
