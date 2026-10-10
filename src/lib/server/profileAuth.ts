import crypto from "crypto";

const SESSION_SECRET = process.env.PROFILE_SESSION_SECRET || "growgear-dev-profile-secret";
export const PROFILE_COOKIE = "gg_profile_session";
export const PROFILE_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function sign(payload: string): string {
  return crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
}

export function createProfileSessionToken(email: string): string {
  const payload = Buffer.from(JSON.stringify({ email, iat: Date.now() }), "utf-8").toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifyProfileSessionToken(token: string | undefined | null): string | null {
  if (!token) return null;
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
