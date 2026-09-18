import { NextRequest, NextResponse } from "next/server";
import { getHiddenPaymentMethods } from "@/lib/server/paymentMethods";

// Public, read-only — the live product/blog pages read this to know which
// payment methods to hide. No admin data is exposed beyond the hidden-key list.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return NextResponse.json({ hidden: getHiddenPaymentMethods(slug) });
}
