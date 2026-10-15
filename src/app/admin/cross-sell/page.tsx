import { Metadata } from "next";
import { getCrossSellSettings } from "@/lib/server/crossSellSettings";
import { allProductsResolved } from "@/lib/server/contentText";
import { CrossSellAdmin } from "@/components/admin/CrossSellAdmin";

export const metadata: Metadata = { title: "অ্যাডমিন — ক্রস-সেল" };
export const dynamic = "force-dynamic";

export default function AdminCrossSellPage() {
  const settings = getCrossSellSettings();
  const all = allProductsResolved();
  const toOption = (p: { slug: string; title: string }) => ({ slug: p.slug, title: p.title });
  const ebooks = all.filter((p) => p.category === "ebook").map(toOption);
  const books = all.filter((p) => p.category === "book").map(toOption);
  const gear = all.filter((p) => p.category === "gear").map(toOption);
  return <CrossSellAdmin initial={settings} ebooks={ebooks} books={books} gear={gear} />;
}
