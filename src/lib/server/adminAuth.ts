const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "growgear-dev-admin-secret";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "growgear2026";
export const ADMIN_COOKIE = "gg_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

const encoder = new TextEncoder();

function bufferToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(Math.floor(hex.length / 2));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

function getKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey("raw", encoder.encode(SESSION_SECRET), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
    "verify",
  ]);
}

export async function createSessionToken(): Promise<string> {
  const payload = String(Date.now());
  const key = await getKey();
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return `${payload}.${bufferToHex(signature)}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const [payload, signatureHex] = token.split(".");
  if (!payload || !signatureHex) return false;
  const key = await getKey();
  return crypto.subtle.verify("HMAC", key, hexToBytes(signatureHex) as BufferSource, encoder.encode(payload));
}

export function checkAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export { SESSION_MAX_AGE_SECONDS };
