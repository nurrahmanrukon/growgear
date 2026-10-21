import { Metadata } from "next";
import { FOOTER_GROUP_CATALOG, getFooterSettings } from "@/lib/server/footerSettings";
import { FooterAdmin } from "@/components/admin/FooterAdmin";

export const metadata: Metadata = { title: "অ্যাডমিন — ফুটার" };
export const dynamic = "force-dynamic";

export default function AdminFooterPage() {
  const { hiddenGroups } = getFooterSettings();
  return <FooterAdmin catalog={FOOTER_GROUP_CATALOG} initialHidden={hiddenGroups} />;
}
