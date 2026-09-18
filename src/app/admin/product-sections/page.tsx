import { Metadata } from "next";
import { allProducts } from "@/lib/data/products";
import { SECTION_CATALOG, isCustomized } from "@/lib/server/sectionOrder";
import { SectionOrderAdmin } from "@/components/admin/SectionOrderAdmin";

export const metadata: Metadata = { title: "অ্যাডমিন — প্রোডাক্ট পেজ সেকশন" };
export const dynamic = "force-dynamic";

export default function AdminProductSectionsPage() {
  const products = allProducts.map((p) => ({
    slug: p.slug,
    title: p.title,
    category: p.category,
    customized: isCustomized(p.slug),
  }));
  return <SectionOrderAdmin initialProducts={products} catalog={SECTION_CATALOG} />;
}
