import { Metadata } from "next";
import { HOME_SECTION_CATALOG, getHomeSectionConfig, isHomeCustomized } from "@/lib/server/homeSectionOrder";
import { HomeSectionOrderAdmin } from "@/components/admin/HomeSectionOrderAdmin";

export const metadata: Metadata = { title: "অ্যাডমিন — হোমপেজ সেকশন" };
export const dynamic = "force-dynamic";

export default function AdminHomeSectionsPage() {
  const config = getHomeSectionConfig();
  return (
    <HomeSectionOrderAdmin
      catalog={HOME_SECTION_CATALOG}
      initialOrder={config.order}
      initialHidden={config.hidden}
      initialCustomized={isHomeCustomized()}
    />
  );
}
