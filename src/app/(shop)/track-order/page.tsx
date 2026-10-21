import { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { getWhatsAppSettings } from "@/lib/server/whatsappSettings";
import { TrackOrderForm } from "@/components/order/TrackOrderForm";

export const metadata: Metadata = { title: "অর্ডার ট্র্যাক করুন — GrowGear" };
export const dynamic = "force-dynamic";

export default async function TrackOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;
  const whatsapp = getWhatsAppSettings();

  return (
    <div className="container-page max-w-lg py-8">
      <Breadcrumb items={[{ label: "হোম", href: "/" }, { label: "অর্ডার ট্র্যাক করুন" }]} />
      <h1 className="mt-3 font-display text-xl font-bold text-foreground sm:text-2xl">অর্ডার ট্র্যাক করুন</h1>
      <p className="mt-1.5 text-sm text-ink-soft">
        আপনার অর্ডার আইডি এবং অর্ডার করার সময় যে ফোন নম্বর দিয়েছিলেন, সেটা দিয়ে অর্ডারের বর্তমান অবস্থা দেখুন।
      </p>
      <TrackOrderForm
        initialOrderId={orderId ?? ""}
        whatsappEnabled={whatsapp.enabled}
        whatsappNumber={whatsapp.number}
      />
    </div>
  );
}
