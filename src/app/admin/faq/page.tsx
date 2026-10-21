import { Metadata } from "next";
import { getFaqSettings } from "@/lib/server/faqSettings";
import { FaqAdmin } from "@/components/admin/FaqAdmin";

export const metadata: Metadata = { title: "অ্যাডমিন — FAQ" };
export const dynamic = "force-dynamic";

export default function AdminFaqPage() {
  const settings = getFaqSettings();
  return <FaqAdmin initial={settings} />;
}
