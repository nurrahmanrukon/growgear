import { NextRequest, NextResponse } from "next/server";
import { verifyProfileSessionToken, PROFILE_COOKIE } from "@/lib/server/profileAuth";
import { getProfile } from "@/lib/server/profiles";

export async function GET(req: NextRequest) {
  const email = verifyProfileSessionToken(req.cookies.get(PROFILE_COOKIE)?.value);
  if (!email) return NextResponse.json({ profile: null });

  const profile = getProfile(email);
  if (!profile) return NextResponse.json({ profile: null });

  return NextResponse.json({
    profile: {
      email: profile.email,
      name: profile.name,
      whatsapp: profile.whatsapp,
      purchases: profile.purchases,
      ebooks: profile.ebooks,
    },
  });
}
