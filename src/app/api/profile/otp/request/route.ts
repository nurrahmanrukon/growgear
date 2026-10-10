import { NextRequest, NextResponse } from "next/server";
import { createOtpChallenge, generateOtpCode } from "@/lib/server/otp";
import { sendOtpEmail, otpEmailIsDevMode } from "@/lib/server/mailer";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
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
    ...(otpEmailIsDevMode() ? { devCode: code } : {}),
  });
}
