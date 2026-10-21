import crypto from "crypto";

// No hardcoded fallback — anyone who knew this secret could craft their own
// codeHash and "verify" it with a code of their own choosing, bypassing the whole
// point of OTP (proving the requester actually received the email).
const OTP_SECRET = process.env.OTP_SESSION_SECRET;
const OTP_TTL_MS = 10 * 60 * 1000;

export interface OtpSignupData {
  email: string;
  name: string;
  whatsapp: string;
}

export function otpSecretConfigured(): boolean {
  return Boolean(OTP_SECRET);
}

function sign(payload: string): string {
  if (!OTP_SECRET) {
    throw new Error("OTP_SESSION_SECRET সেট করা নেই — এনভায়রনমেন্ট ভ্যারিয়েবল কনফিগার করুন।");
  }
  return crypto.createHmac("sha256", OTP_SECRET).update(payload).digest("hex");
}

export function generateOtpCode(): string {
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
}

/** The challenge token carries a hash of the code (never the code itself), so a client
 *  who never received the email still can't read the code back out of their own token. */
export function createOtpChallenge(data: OtpSignupData, code: string): string {
  const codeHash = crypto.createHash("sha256").update(code).digest("hex");
  const payload = Buffer.from(
    JSON.stringify({ ...data, codeHash, exp: Date.now() + OTP_TTL_MS }),
    "utf-8"
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifyOtpChallenge(challenge: string, code: string): OtpSignupData | null {
  if (!OTP_SECRET) return null;
  const [payload, signature] = challenge.split(".");
  if (!payload || !signature) return null;
  if (sign(payload) !== signature) return null;

  let data: OtpSignupData & { codeHash: string; exp: number };
  try {
    data = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"));
  } catch {
    return null;
  }
  if (Date.now() > data.exp) return null;

  const codeHash = crypto.createHash("sha256").update(code.trim()).digest("hex");
  if (codeHash !== data.codeHash) return null;

  return { email: data.email, name: data.name, whatsapp: data.whatsapp };
}
