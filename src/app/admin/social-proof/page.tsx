import { Metadata } from "next";
import { allProducts } from "@/lib/data/products";
import { isCustomized } from "@/lib/server/socialProofPosts";
import { SocialProofAdmin } from "@/components/admin/SocialProofAdmin";

export const metadata: Metadata = { title: "অ্যাডমিন — সোশ্যাল মিডিয়া স্ক্রিনশট" };
export const dynamic = "force-dynamic";

export default function AdminSocialProofPage() {
  const products = allProducts.map((p) => ({
    slug: p.slug,
    title: p.title,
    category: p.category,
    customized: isCustomized(p.slug),
  }));
  return <SocialProofAdmin initialProducts={products} />;
}
