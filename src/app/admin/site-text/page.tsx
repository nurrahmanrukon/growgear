import { Metadata } from "next";
import { getSiteTextSettings } from "@/lib/server/siteTextSettings";
import { SiteTextAdmin } from "@/components/admin/SiteTextAdmin";

export const metadata: Metadata = { title: "অ্যাডমিন — সাইটের লেখা" };
export const dynamic = "force-dynamic";

export default function AdminSiteTextPage() {
  const settings = getSiteTextSettings();
  return <SiteTextAdmin initial={settings} />;
}
