import { Metadata } from "next";
import { blogPosts } from "@/lib/data/blog";
import { getNewsletterSettings } from "@/lib/server/newsletterSettings";
import { NewsletterAdmin } from "@/components/admin/NewsletterAdmin";

export const metadata: Metadata = { title: "অ্যাডমিন — নিউজলেটার" };
export const dynamic = "force-dynamic";

export default function AdminNewsletterPage() {
  const settings = getNewsletterSettings();
  const premiumPosts = blogPosts.filter((p) => p.premium).map((p) => ({ slug: p.slug, title: p.title }));
  return <NewsletterAdmin initial={settings} premiumPosts={premiumPosts} />;
}
