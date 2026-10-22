import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminAuthConfigured,
  checkAdminPassword,
  createSessionToken,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/server/adminAuth";
import { checkRateLimit, clientIp, RATE_LIMIT_MESSAGE } from "@/lib/server/rateLimit";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS_PER_IP = 10;

export async function POST(req: NextRequest) {
  if (!adminAuthConfigured()) {
    return NextResponse.json(
      { error: "সার্ভার কনফিগারেশন অসম্পূর্ণ — ADMIN_PASSWORD ও ADMIN_SESSION_SECRET এনভায়রনমেন্ট ভ্যারিয়েবল সেট করা নেই।" },
      { status: 500 }
    );
  }

  const ip = clientIp(req);
  const limit = checkRateLimit(`admin-login:ip:${ip}`, MAX_ATTEMPTS_PER_IP, WINDOW_MS);
  if (!limit.allowed) {
    return NextResponse.json({ error: RATE_LIMIT_MESSAGE }, { status: 429 });
  }

  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "অবৈধ রিকোয়েস্ট" }, { status: 400 });
  }

  if (!body.password || !checkAdminPassword(body.password)) {
    return NextResponse.json({ error: "পাসওয়ার্ড সঠিক নয়" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, await createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return res;
}
