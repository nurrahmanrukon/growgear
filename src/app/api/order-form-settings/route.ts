import { NextResponse } from "next/server";
import { getOrderFormSettings } from "@/lib/server/orderFormSettings";
import { getWhatsAppSettings } from "@/lib/server/whatsappSettings";

// Public, read-only — the quick-order form and checkout page read this to
// render delivery-zone and quantity-tier options with admin-edited text.
export async function GET() {
  const settings = getOrderFormSettings();
  const wa = getWhatsAppSettings();
  const bulkWhatsappHref = wa.enabled
    ? `https://wa.me/${wa.number}?text=${encodeURIComponent(
        "আসসালামু আলাইকুম, আমি কর্পোরেট/বাল্ক অর্ডার সম্পর্কে জানতে চাই।"
      )}`
    : null;
  return NextResponse.json({ ...settings, bulkWhatsappHref });
}
