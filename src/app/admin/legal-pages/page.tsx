import { Metadata } from "next";
import { getLegalPagesSettings } from "@/lib/server/legalPages";
import { LegalPagesAdmin } from "@/components/admin/LegalPagesAdmin";

export const metadata: Metadata = { title: "অ্যাডমিন — আইনি পেজ" };
export const dynamic = "force-dynamic";

export default function AdminLegalPagesPage() {
  const settings = getLegalPagesSettings();
  return <LegalPagesAdmin initial={settings} />;
}
