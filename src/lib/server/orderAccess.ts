import crypto from "crypto";

const SESSION_SECRET = process.env.ORDER_SESSION_SECRET || "growgear-dev-order-secret";
export const ORDER_ACCESS_COOKIE = "gg_order_access";
export const ORDER_ACCESS_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

/** How many recent order IDs a single browser's access token remembers — generous
 *  enough for a whole cross-sell purchase journey plus repeat visits, small enough
 *  to keep the cookie compact. */
const MAX_REMEMBERED_ORDERS = 20;

function sign(payload: string): string {
  return crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
}

function decode(token: string | undefined | null): string[] {
  if (!token) return [];
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return [];
  if (sign(payload) !== signature) return [];
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"));
    return Array.isArray(data) ? data.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function encode(orderIds: string[]): string {
  const payload = Buffer.from(JSON.stringify(orderIds), "utf-8").toString("base64url");
  return `${payload}.${sign(payload)}`;
}

/** Only a browser that was actually handed this order ID right after creating it
 *  (via the token this function returns, set as an httpOnly cookie) can later view
 *  that order's customer details on /order-success — a guessed or shared order ID
 *  alone is not enough. */
export function addOrderToAccessToken(existingToken: string | undefined | null, orderId: string): string {
  const ids = decode(existingToken).filter((id) => id !== orderId);
  ids.push(orderId);
  while (ids.length > MAX_REMEMBERED_ORDERS) ids.shift();
  return encode(ids);
}

export function tokenGrantsAccess(token: string | undefined | null, orderId: string): boolean {
  return decode(token).includes(orderId);
}
