import { Metadata } from "next";
import { getHeaderSubNavSettings } from "@/lib/server/headerSubNavSettings";
import { HeaderSubNavAdmin } from "@/components/admin/HeaderSubNavAdmin";

export const metadata: Metadata = { title: "অ্যাডমিন — হেডার সাব-মেনু" };
export const dynamic = "force-dynamic";

export default function AdminHeaderSubNavPage() {
  const settings = getHeaderSubNavSettings();
  return <HeaderSubNavAdmin initial={settings} />;
}
