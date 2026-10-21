import { Metadata } from "next";
import { getFooterSettings } from "@/lib/server/footerSettings";
import { FooterAdmin } from "@/components/admin/FooterAdmin";

export const metadata: Metadata = { title: "অ্যাডমিন — ফুটার" };
export const dynamic = "force-dynamic";

export default function AdminFooterPage() {
  const settings = getFooterSettings();
  return <FooterAdmin initial={settings} />;
}
