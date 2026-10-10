import crypto from "crypto";

const OTP_SECRET = process.env.OTP_SESSION_SECRET || "growgear-dev-otp-secret";
const OTP_TTL_MS = 10 * 60 * 1000;

export interface OtpSignupData {
  email: string;
  name: string;
  whatsapp: string;
}

function sign(payload: string): string {
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
