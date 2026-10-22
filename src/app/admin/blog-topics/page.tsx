import { Metadata } from "next";
import { getBlogTopicSettings } from "@/lib/server/blogTopicSettings";
import { BlogTopicsAdmin } from "@/components/admin/BlogTopicsAdmin";

export const metadata: Metadata = { title: "অ্যাডমিন — ব্লগ বিষয় ও সেগমেন্ট" };
export const dynamic = "force-dynamic";

export default function AdminBlogTopicsPage() {
  const settings = getBlogTopicSettings();
  return <BlogTopicsAdmin initial={settings} />;
}
