import { NextRequest, NextResponse } from "next/server";
import { verifyProfileSessionToken, PROFILE_COOKIE } from "@/lib/server/profileAuth";
import { addPurchase, PremiumTier } from "@/lib/server/profiles";

const VALID_TIERS = new Set<PremiumTier>(["text", "audio", "both"]);

export async function POST(req: NextRequest) {
  const email = verifyProfileSessionToken(req.cookies.get(PROFILE_COOKIE)?.value);
  if (!email) return NextResponse.json({ error: "লগইন আবশ্যক" }, { status: 401 });

  let body: { slug?: string; tier?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "অবৈধ রিকোয়েস্ট" }, { status: 400 });
  }

  if (!body.slug || !body.tier || !VALID_TIERS.has(body.tier as PremiumTier)) {
    return NextResponse.json({ error: "অবৈধ রিকোয়েস্ট" }, { status: 400 });
  }

  const profile = addPurchase(email, body.slug, body.tier as PremiumTier);
  return NextResponse.json({ ok: true, purchases: profile.purchases });
}
