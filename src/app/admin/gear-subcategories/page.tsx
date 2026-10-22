import { Metadata } from "next";
import { getGearSubcategorySettings } from "@/lib/server/gearSubcategorySettings";
import { GearSubcategoryAdmin } from "@/components/admin/GearSubcategoryAdmin";

export const metadata: Metadata = { title: "অ্যাডমিন — গিয়ার সাব-ক্যাটাগরি" };
export const dynamic = "force-dynamic";

export default function AdminGearSubcategoriesPage() {
  const settings = getGearSubcategorySettings();
  return <GearSubcategoryAdmin initial={settings} />;
}
