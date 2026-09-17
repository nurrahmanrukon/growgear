import { Metadata } from "next";
import { getAllBlogFormats } from "@/lib/server/blogFormats";
import { BlogFormatsAdmin } from "@/components/admin/BlogFormatsAdmin";

export const metadata: Metadata = { title: "অ্যাডমিন — ব্লগ ফরম্যাট" };
export const dynamic = "force-dynamic";

export default function AdminBlogPage() {
  const posts = getAllBlogFormats();
  return <BlogFormatsAdmin initialPosts={posts} />;
}
