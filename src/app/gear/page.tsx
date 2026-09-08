import { Metadata } from "next";
import { gear } from "@/lib/data/gear";
import { categoryMeta } from "@/lib/data/products";
import { ProductListing } from "@/components/product/ProductListing";

export const metadata: Metadata = { title: "গিয়ার — GrowGear" };

export default async function GearPage({
  searchParams,
}: {
  searchParams: Promise<{ badge?: string }>;
}) {
  const { badge } = await searchParams;
  return (
    <ProductListing
      title={categoryMeta.gear.label}
      description={categoryMeta.gear.description}
      products={gear}
      basePath="/gear"
      initialBadge={badge}
    />
  );
}
