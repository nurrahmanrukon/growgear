const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.OTP_FROM_EMAIL || "GrowGear <onboarding@resend.dev>";

export async function sendOtpEmail(email: string, code: string): Promise<void> {
  const subject = "আপনার GrowGear ভেরিফিকেশন কোড";
  const text = `আপনার ভেরিফিকেশন কোড: ${code}\n\nএই কোডটি ১০ মিনিটের জন্য কার্যকর থাকবে। আপনি যদি এই কোড না চান, এই মেসেজটি উপেক্ষা করুন।`;

  if (!RESEND_API_KEY) {
    console.log(`[OTP DEV MODE — কোনো RESEND_API_KEY সেট নেই] ${email} → কোড: ${code}`);
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM_EMAIL, to: email, subject, text }),
  });

  if (!res.ok) {
    console.error("OTP email failed to send:", await res.text());
    throw new Error("ইমেইল পাঠাতে সমস্যা হয়েছে");
  }
}

export function otpEmailIsDevMode(): boolean {
  return !RESEND_API_KEY;
}
