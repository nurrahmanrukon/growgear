import { Metadata } from "next";
import { getWhatsAppSettings } from "@/lib/server/whatsappSettings";
import { WhatsAppAdmin } from "@/components/admin/WhatsAppAdmin";

export const metadata: Metadata = { title: "অ্যাডমিন — হোয়াটসঅ্যাপ" };
export const dynamic = "force-dynamic";

export default function AdminWhatsAppPage() {
  const settings = getWhatsAppSettings();
  return <WhatsAppAdmin initial={settings} />;
}
