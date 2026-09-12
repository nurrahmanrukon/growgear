import { Metadata } from "next";
import { gear, GEAR_SUBCATEGORIES } from "@/lib/data/gear";
import { categoryMeta } from "@/lib/data/products";
import { ProductListing } from "@/components/product/ProductListing";

export const metadata: Metadata = { title: "গিয়ার — GrowGear" };

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
      products={gear}
      basePath="/gear"
      initialBadge={badge}
      initialSubcategory={subcategory?.slug}
      subcategoryLabel={subcategory?.label}
    />
  );
}
