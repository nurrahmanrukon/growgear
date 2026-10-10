import { NextRequest, NextResponse } from "next/server";
import { verifyOtpChallenge } from "@/lib/server/otp";
import { upsertProfile } from "@/lib/server/profiles";
import { createProfileSessionToken, PROFILE_COOKIE, PROFILE_SESSION_MAX_AGE_SECONDS } from "@/lib/server/profileAuth";

export async function POST(req: NextRequest) {
  let body: { challenge?: string; code?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "অবৈধ রিকোয়েস্ট" }, { status: 400 });
  }

  if (!body.challenge || !body.code) {
    return NextResponse.json({ error: "কোড আবশ্যক" }, { status: 400 });
  }

  const data = verifyOtpChallenge(body.challenge, body.code);
  if (!data) {
    return NextResponse.json({ error: "কোড সঠিক নয় বা মেয়াদ শেষ হয়ে গেছে" }, { status: 401 });
  }

  const profile = upsertProfile(data);

  const res = NextResponse.json({
    ok: true,
    profile: { email: profile.email, name: profile.name, whatsapp: profile.whatsapp },
  });
  res.cookies.set(PROFILE_COOKIE, createProfileSessionToken(profile.email), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: PROFILE_SESSION_MAX_AGE_SECONDS,
  });
  return res;
}
