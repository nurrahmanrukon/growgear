import { Metadata } from "next";
import { getGrowGuideFaqSettings } from "@/lib/server/growguideFaqSettings";
import { GrowGuideFaqAdmin } from "@/components/admin/GrowGuideFaqAdmin";

export const metadata: Metadata = { title: "অ্যাডমিন — GrowGuide FAQ" };
export const dynamic = "force-dynamic";

export default function AdminGrowGuideFaqPage() {
  const settings = getGrowGuideFaqSettings();
  return <GrowGuideFaqAdmin initial={settings} />;
}
