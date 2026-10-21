import { NextRequest, NextResponse } from "next/server";
import { validateCoupon } from "@/lib/server/couponSettings";
import { validatePromoCode } from "@/lib/data/promo";
import { checkRateLimit, clientIp, RATE_LIMIT_MESSAGE } from "@/lib/server/rateLimit";

export async function POST(req: NextRequest) {
  const rate = checkRateLimit(`coupon-validate:${clientIp(req)}`, 10, 10 * 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json({ error: RATE_LIMIT_MESSAGE }, { status: 429 });
  }

  let body: { code?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "অবৈধ রিকোয়েস্ট" }, { status: 400 });
  }

  const code = body.code?.trim();
  const coupon = validateCoupon(code);
  if (coupon.valid) {
    return NextResponse.json({ valid: true, discountPercent: coupon.discountPercent });
  }

  const promo = validatePromoCode(code ?? "");
  if (promo) {
    return NextResponse.json({ valid: true, discountPercent: promo.discountPercent });
  }

  return NextResponse.json({ valid: false, error: "কুপন কোডটি সঠিক নয়" }, { status: 400 });
}
