import { Metadata } from "next";
import { getPurchaseToastSettings } from "@/lib/server/purchaseToastSettings";
import { PurchaseToastAdmin } from "@/components/admin/PurchaseToastAdmin";

export const metadata: Metadata = { title: "অ্যাডমিন — ক্রয় বিজ্ঞপ্তি" };
export const dynamic = "force-dynamic";

export default function AdminPurchaseToastPage() {
  const settings = getPurchaseToastSettings();
  return <PurchaseToastAdmin initial={settings} />;
}
