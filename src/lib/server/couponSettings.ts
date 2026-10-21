import fs from "fs";
import path from "path";

export interface CouponSettings {
  enabled: boolean;
  code: string;
  discountPercent: number;
}

const FILE_PATH = path.join(process.cwd(), "data", "coupon-settings.json");

const DEFAULTS: CouponSettings = {
  enabled: false,
  code: "",
  discountPercent: 10,
};

function cleanPercent(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? Math.min(100, Math.max(0, Math.round(value))) : DEFAULTS.discountPercent;
}

export function getCouponSettings(): CouponSettings {
  try {
    const raw = fs.readFileSync(FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Partial<CouponSettings>;
    return {
      enabled: typeof parsed.enabled === "boolean" ? parsed.enabled : DEFAULTS.enabled,
      code: typeof parsed.code === "string" ? parsed.code.trim() : DEFAULTS.code,
      discountPercent: cleanPercent(parsed.discountPercent),
    };
  } catch {
    return DEFAULTS;
  }
}

export function setCouponSettings(update: Partial<CouponSettings>): CouponSettings {
  const current = getCouponSettings();
  const next: CouponSettings = {
    enabled: update.enabled !== undefined ? update.enabled : current.enabled,
    code: update.code !== undefined ? update.code.trim() : current.code,
    discountPercent: update.discountPercent !== undefined ? cleanPercent(update.discountPercent) : current.discountPercent,
  };
  fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true });
  fs.writeFileSync(FILE_PATH, JSON.stringify(next, null, 2));
  return next;
}

/** Server-side coupon check — the only place that decides whether a code is valid and
 *  what it's worth. Never trust a discount amount sent by the client; always re-derive
 *  it here (or via the existing promo.ts marketing codes) from the submitted code. */
export function validateCoupon(codeInput: string | null | undefined): { valid: boolean; discountPercent: number } {
  const settings = getCouponSettings();
  if (!settings.enabled || !settings.code || !codeInput) return { valid: false, discountPercent: 0 };
  const match = codeInput.trim().toLowerCase() === settings.code.toLowerCase();
  return match ? { valid: true, discountPercent: settings.discountPercent } : { valid: false, discountPercent: 0 };
}
