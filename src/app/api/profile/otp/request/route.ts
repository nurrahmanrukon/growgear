import { NextRequest, NextResponse } from "next/server";
import { createOtpChallenge, generateOtpCode, otpSecretConfigured } from "@/lib/server/otp";
import { sendOtpEmail, otpDevCodeAllowed } from "@/lib/server/mailer";
import { checkRateLimit, clientIp, RATE_LIMIT_MESSAGE } from "@/lib/server/rateLimit";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_IP = 10;
const MAX_PER_EMAIL = 5;

export async function POST(req: NextRequest) {
  if (!otpSecretConfigured()) {
    return NextResponse.json(
      { error: "সার্ভার কনফিগারেশন অসম্পূর্ণ — OTP_SESSION_SECRET এনভায়রনমেন্ট ভ্যারিয়েবল সেট করা নেই।" },
      { status: 500 }
    );
  }

  let body: { name?: string; email?: string; whatsapp?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "অবৈধ রিকোয়েস্ট" }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const whatsapp = (body.whatsapp ?? "").trim();

  if (!name) return NextResponse.json({ error: "নাম আবশ্যক" }, { status: 400 });
  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "সঠিক ইমেইল ঠিকানা দিন" }, { status: 400 });
  }
  if (whatsapp.length < 11) {
    return NextResponse.json({ error: "সঠিক হোয়াটসঅ্যাপ নম্বর দিন" }, { status: 400 });
  }

  const ip = clientIp(req);
  const ipLimit = checkRateLimit(`otp-request:ip:${ip}`, MAX_PER_IP, WINDOW_MS);
  const emailLimit = checkRateLimit(`otp-request:email:${email.toLowerCase()}`, MAX_PER_EMAIL, WINDOW_MS);
  if (!ipLimit.allowed || !emailLimit.allowed) {
    return NextResponse.json({ error: RATE_LIMIT_MESSAGE }, { status: 429 });
  }

  const code = generateOtpCode();
  const challenge = createOtpChallenge({ email, name, whatsapp }, code);

  try {
    await sendOtpEmail(email, code);
  } catch {
    return NextResponse.json({ error: "ইমেইল পাঠাতে সমস্যা হয়েছে, আবার চেষ্টা করুন" }, { status: 502 });
  }

  return NextResponse.json({
    ok: true,
    challenge,
    ...(otpDevCodeAllowed() ? { devCode: code } : {}),
  });
}
