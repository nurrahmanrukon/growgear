import { Metadata } from "next";
import { getBlogSearchSettings } from "@/lib/server/blogSearchSettings";
import { BlogSearchSettingsAdmin } from "@/components/admin/BlogSearchSettingsAdmin";

export const metadata: Metadata = { title: "অ্যাডমিন — ব্লগ সার্চ" };
export const dynamic = "force-dynamic";

export default function AdminBlogSearchPage() {
  const settings = getBlogSearchSettings();
  return <BlogSearchSettingsAdmin initial={settings} />;
}
