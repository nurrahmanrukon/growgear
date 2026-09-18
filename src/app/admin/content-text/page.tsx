import { Metadata } from "next";
import { getAllProductTextEntries, getAllBlogTextEntries } from "@/lib/server/contentText";
import { ContentTextAdmin } from "@/components/admin/ContentTextAdmin";

export const metadata: Metadata = { title: "অ্যাডমিন — টেক্সট কনটেন্ট" };
export const dynamic = "force-dynamic";

export default function AdminContentTextPage() {
  const products = getAllProductTextEntries();
  const blog = getAllBlogTextEntries();
  return <ContentTextAdmin initialProducts={products} initialBlog={blog} />;
}
