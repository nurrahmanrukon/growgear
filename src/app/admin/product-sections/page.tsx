import { Metadata } from "next";
import { SECTION_CATALOG, getSectionOrder } from "@/lib/server/sectionOrder";
import { SectionOrderAdmin } from "@/components/admin/SectionOrderAdmin";

export const metadata: Metadata = { title: "অ্যাডমিন — প্রোডাক্ট পেজ সেকশন" };
export const dynamic = "force-dynamic";

export default function AdminProductSectionsPage() {
  const order = getSectionOrder();
  return <SectionOrderAdmin initialOrder={order} catalog={SECTION_CATALOG} />;
}
