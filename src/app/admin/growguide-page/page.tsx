import { Metadata } from "next";
import { getGrowGuidePageSettings } from "@/lib/server/growguidePageSettings";
import { GrowGuidePageAdmin } from "@/components/admin/GrowGuidePageAdmin";

export const metadata: Metadata = { title: "অ্যাডমিন — GrowGuide পেজ" };
export const dynamic = "force-dynamic";

export default function AdminGrowGuidePagePage() {
  const settings = getGrowGuidePageSettings();
  return <GrowGuidePageAdmin initial={settings} />;
}
