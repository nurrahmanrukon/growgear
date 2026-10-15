import { Metadata } from "next";
import { getCrossSellSettings } from "@/lib/server/crossSellSettings";
import { allProductsResolved } from "@/lib/server/contentText";
import { CrossSellAdmin } from "@/components/admin/CrossSellAdmin";

export const metadata: Metadata = { title: "অ্যাডমিন — ইবুক ক্রস-সেল" };
export const dynamic = "force-dynamic";

export default function AdminCrossSellPage() {
  const settings = getCrossSellSettings();
  const ebooks = allProductsResolved()
    .filter((p) => p.category === "ebook")
    .map((p) => ({ slug: p.slug, title: p.title }));
  return <CrossSellAdmin initial={settings} ebooks={ebooks} />;
}
