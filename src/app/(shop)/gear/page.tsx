import { Metadata } from "next";
import { GEAR_SUBCATEGORIES } from "@/lib/data/gear";
import { categoryMeta } from "@/lib/data/products";
import { gearResolved } from "@/lib/server/contentText";
import { ProductListing } from "@/components/product/ProductListing";

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
    <ProductListing
      title={subcategory ? `${categoryMeta.gear.label} — ${subcategory.label}` : categoryMeta.gear.label}
      description={categoryMeta.gear.description}
      products={gearResolved()}
      initialBadge={badge}
      initialSubcategory={subcategory?.slug}
    />
  );
}
