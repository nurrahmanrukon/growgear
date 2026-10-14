import fs from "fs";
import path from "path";

export interface DeliveryZone {
  key: string;
  label: string;
  days: string;
  fee: number;
}

export interface QuantityTier {
  quantity: number;
  description: string;
  badge?: string;
}

export interface OrderFormSettings {
  deliveryZones: DeliveryZone[];
  quantityTiers: QuantityTier[];
  bulkLabel: string;
  bulkSubtext: string;
  bulkCta: string;
}

const FILE_PATH = path.join(process.cwd(), "data", "order-form-settings.json");

const DEFAULTS: OrderFormSettings = {
  deliveryZones: [
    { key: "inside-dhaka", label: "ঢাকার ভিতরে", days: "২-৩ দিন", fee: 70 },
    { key: "outside-dhaka", label: "ঢাকার বাইরে", days: "৪-৬ দিন", fee: 130 },
  ],
  quantityTiers: [
    { quantity: 1, description: "নিজের জন্য" },
    { quantity: 2, description: "১টি গিফট করুন" },
    { quantity: 3, description: "পরিবার/টিমের জন্য", badge: "সবচেয়ে জনপ্রিয়" },
  ],
  bulkLabel: "কর্পোরেট অর্ডার",
  bulkSubtext: "১০+ কপি — বিশেষ ছাড়",
  bulkCta: "হোয়াটসঅ্যাপে দাম জানুন",
};

function cleanZones(raw: unknown): DeliveryZone[] {
  if (!Array.isArray(raw)) return DEFAULTS.deliveryZones;
  const cleaned = raw
    .filter((z): z is Record<string, unknown> => typeof z === "object" && z !== null)
    .map((z, i) => ({
      key: typeof z.key === "string" && z.key.trim() ? z.key.trim() : `zone-${i}`,
      label: typeof z.label === "string" ? z.label.trim() : "",
      days: typeof z.days === "string" ? z.days.trim() : "",
      fee: typeof z.fee === "number" && Number.isFinite(z.fee) && z.fee >= 0 ? Math.round(z.fee) : 0,
    }))
    .filter((z) => z.label.length > 0);
  return cleaned.length > 0 ? cleaned : DEFAULTS.deliveryZones;
}

function cleanTiers(raw: unknown): QuantityTier[] {
  if (!Array.isArray(raw)) return DEFAULTS.quantityTiers;
  const cleaned = raw
    .filter((t): t is Record<string, unknown> => typeof t === "object" && t !== null)
    .map((t) => ({
      quantity:
        typeof t.quantity === "number" && Number.isInteger(t.quantity) && t.quantity > 0 ? t.quantity : 1,
      description: typeof t.description === "string" ? t.description.trim() : "",
      badge: typeof t.badge === "string" && t.badge.trim() ? t.badge.trim() : undefined,
    }))
    .filter((t) => t.description.length > 0);
  return cleaned.length > 0 ? cleaned : DEFAULTS.quantityTiers;
}

export function getOrderFormSettings(): OrderFormSettings {
  try {
    const raw = fs.readFileSync(FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Partial<OrderFormSettings>;
    return {
      deliveryZones: cleanZones(parsed.deliveryZones),
      quantityTiers: cleanTiers(parsed.quantityTiers),
      bulkLabel: typeof parsed.bulkLabel === "string" && parsed.bulkLabel.trim() ? parsed.bulkLabel.trim() : DEFAULTS.bulkLabel,
      bulkSubtext:
        typeof parsed.bulkSubtext === "string" && parsed.bulkSubtext.trim() ? parsed.bulkSubtext.trim() : DEFAULTS.bulkSubtext,
      bulkCta: typeof parsed.bulkCta === "string" && parsed.bulkCta.trim() ? parsed.bulkCta.trim() : DEFAULTS.bulkCta,
    };
  } catch {
    return DEFAULTS;
  }
}

export function setOrderFormSettings(update: Partial<OrderFormSettings>): OrderFormSettings {
  const current = getOrderFormSettings();
  const next: OrderFormSettings = {
    deliveryZones: update.deliveryZones !== undefined ? cleanZones(update.deliveryZones) : current.deliveryZones,
    quantityTiers: update.quantityTiers !== undefined ? cleanTiers(update.quantityTiers) : current.quantityTiers,
    bulkLabel: update.bulkLabel?.trim() || current.bulkLabel,
    bulkSubtext: update.bulkSubtext?.trim() || current.bulkSubtext,
    bulkCta: update.bulkCta?.trim() || current.bulkCta,
  };
  fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true });
  fs.writeFileSync(FILE_PATH, JSON.stringify(next, null, 2));
  return next;
}

/** label -> delivery fee (taka), for server-side total calculation (checkout route). */
export function getDeliveryFeeMap(): Record<string, number> {
  const settings = getOrderFormSettings();
  return Object.fromEntries(settings.deliveryZones.map((z) => [z.label, z.fee]));
}
