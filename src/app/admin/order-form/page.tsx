import { Metadata } from "next";
import { getOrderFormSettings } from "@/lib/server/orderFormSettings";
import { OrderFormSettingsAdmin } from "@/components/admin/OrderFormSettingsAdmin";

export const metadata: Metadata = { title: "অ্যাডমিন — অর্ডার ফর্ম" };
export const dynamic = "force-dynamic";

export default function AdminOrderFormPage() {
  const settings = getOrderFormSettings();
  return <OrderFormSettingsAdmin initial={settings} />;
}
