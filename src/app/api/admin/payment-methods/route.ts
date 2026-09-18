import { NextResponse } from "next/server";
import { PAYMENT_METHOD_CATALOG, getAllPaymentEntries } from "@/lib/server/paymentMethods";

export async function GET() {
  return NextResponse.json({ catalog: PAYMENT_METHOD_CATALOG, items: getAllPaymentEntries() });
}
