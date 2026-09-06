export interface PromoCode {
  code: string;
  discountPercent: number;
  source: string;
}

export const PROMO_CODES: PromoCode[] = [
  { code: "NUR10", discountPercent: 10, source: "Nur Rahman Podcast" },
  { code: "PODCAST10", discountPercent: 10, source: "Nur Rahman Podcast" },
  { code: "ENRICH10", discountPercent: 10, source: "Enrich Everyday by Nur Rahman" },
];

export function validatePromoCode(input: string): PromoCode | null {
  const normalized = input.trim().toUpperCase();
  if (!normalized) return null;
  return PROMO_CODES.find((p) => p.code === normalized) ?? null;
}
