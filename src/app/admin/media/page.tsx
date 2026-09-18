import { Metadata } from "next";
import { getAllProductMediaEntries, getAllBlogMediaEntries } from "@/lib/server/mediaAssets";
import { MediaAdmin } from "@/components/admin/MediaAdmin";

export const metadata: Metadata = { title: "অ্যাডমিন — ছবি ও ভিডিও" };
export const dynamic = "force-dynamic";

export default function AdminMediaPage() {
  const products = getAllProductMediaEntries();
  const blog = getAllBlogMediaEntries();
  return <MediaAdmin initialProducts={products} initialBlog={blog} />;
}
