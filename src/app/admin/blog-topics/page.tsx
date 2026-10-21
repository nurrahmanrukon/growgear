import { Metadata } from "next";
import { getBlogTopicOrderSettings } from "@/lib/server/blogTopicOrderSettings";
import { BlogTopicOrderAdmin } from "@/components/admin/BlogTopicOrderAdmin";

export const metadata: Metadata = { title: "অ্যাডমিন — ব্লগ বিষয়ের ক্রম" };
export const dynamic = "force-dynamic";

export default function AdminBlogTopicsPage() {
  const settings = getBlogTopicOrderSettings();
  return <BlogTopicOrderAdmin initial={settings} />;
}
