import crypto from "crypto";

// No hardcoded fallback — a secret baked into the source would let anyone with repo
// access forge a valid profile session for any customer email on a deployment that
// forgot to configure its own.
const SESSION_SECRET = process.env.PROFILE_SESSION_SECRET;
export const PROFILE_COOKIE = "gg_profile_session";
export const PROFILE_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function sign(payload: string): string {
  if (!SESSION_SECRET) {
    throw new Error("PROFILE_SESSION_SECRET সেট করা নেই — এনভায়রনমেন্ট ভ্যারিয়েবল কনফিগার করুন।");
  }
  return crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
}

export function createProfileSessionToken(email: string): string {
  const payload = Buffer.from(JSON.stringify({ email, iat: Date.now() }), "utf-8").toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifyProfileSessionToken(token: string | undefined | null): string | null {
  if (!token || !SESSION_SECRET) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  if (sign(payload) !== signature) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"));
    return typeof data.email === "string" ? data.email : null;
  } catch {
    return null;
  }
}
