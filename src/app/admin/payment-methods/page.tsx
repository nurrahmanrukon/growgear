import { Metadata } from "next";
import { PAYMENT_METHOD_CATALOG, getAllPaymentEntries } from "@/lib/server/paymentMethods";
import { PaymentMethodsAdmin } from "@/components/admin/PaymentMethodsAdmin";

export const metadata: Metadata = { title: "অ্যাডমিন — পেমেন্ট পদ্ধতি" };
export const dynamic = "force-dynamic";

export default function AdminPaymentMethodsPage() {
  const items = getAllPaymentEntries();
  return <PaymentMethodsAdmin initialItems={items} catalog={PAYMENT_METHOD_CATALOG} />;
}
