import { NextResponse } from "next/server";
import { getCouponSettings } from "@/lib/server/couponSettings";

/** Public — only reveals whether the coupon box should be shown, never the code or percent
 *  (those are only confirmed once someone submits the correct code via /api/coupon/validate). */
export async function GET() {
  const settings = getCouponSettings();
  return NextResponse.json({ enabled: settings.enabled });
}
