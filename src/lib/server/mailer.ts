const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.OTP_FROM_EMAIL || "GrowGear <onboarding@resend.dev>";

/** Must be explicitly opted into (never implied by a missing API key) — a deployed
 *  site that simply forgot to set RESEND_API_KEY must fail loudly, not quietly start
 *  handing out verification codes to whoever calls the API. */
export function otpDevCodeAllowed(): boolean {
  return process.env.ALLOW_OTP_DEV_CODE === "true";
}

export async function sendOtpEmail(email: string, code: string): Promise<void> {
  const subject = "আপনার GrowGear ভেরিফিকেশন কোড";
  const text = `আপনার ভেরিফিকেশন কোড: ${code}\n\nএই কোডটি ১০ মিনিটের জন্য কার্যকর থাকবে। আপনি যদি এই কোড না চান, এই মেসেজটি উপেক্ষা করুন।`;

  if (!RESEND_API_KEY) {
    if (otpDevCodeAllowed()) {
      console.log(`[OTP DEV MODE — কোনো RESEND_API_KEY সেট নেই] ${email} → কোড: ${code}`);
      return;
    }
    // No API key and dev mode not explicitly enabled — this is a production
    // misconfiguration, not a safe fallback, so fail the request instead of
    // silently "succeeding" with no email ever sent.
    console.error("RESEND_API_KEY সেট করা নেই এবং ALLOW_OTP_DEV_CODE চালু নেই — OTP ইমেইল পাঠানো যায়নি।");
    throw new Error("ইমেইল পাঠাতে সমস্যা হয়েছে");
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

/** General-purpose transactional email (newsletter freebies etc.) — unlike sendOtpEmail,
 *  a missing API key here isn't a security concern, just a configuration gap, so it logs
 *  and returns instead of throwing. The caller still gets a clean success/failure signal
 *  for genuine send failures (API key present but the request itself failed). */
export async function sendTransactionalEmail(to: string, subject: string, text: string): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.log(`[EMAIL DEV MODE — কোনো RESEND_API_KEY সেট নেই] ${to} → বিষয়: ${subject}`);
    return false;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, text }),
  });

  if (!res.ok) {
    console.error("Transactional email failed to send:", await res.text());
    return false;
  }
  return true;
}
