import { Metadata } from "next";
import { getGrowGuideAudienceSettings } from "@/lib/server/growguideAudienceSettings";
import { GrowGuideAudienceAdmin } from "@/components/admin/GrowGuideAudienceAdmin";

export const metadata: Metadata = { title: "অ্যাডমিন — GrowGuide অডিয়েন্স" };
export const dynamic = "force-dynamic";

export default function AdminGrowGuideAudiencePage() {
  const settings = getGrowGuideAudienceSettings();
  return <GrowGuideAudienceAdmin initial={settings} />;
}
