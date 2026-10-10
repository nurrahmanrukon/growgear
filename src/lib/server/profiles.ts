import fs from "fs";
import path from "path";

export type PremiumTier = "text" | "audio" | "both";

export interface ProfilePurchase {
  slug: string;
  tier: PremiumTier;
  unlockedAt: string;
}

export interface ProfileRecord {
  email: string;
  name: string;
  whatsapp: string;
  createdAt: string;
  purchases: ProfilePurchase[];
}

const STORE_PATH = path.join(process.cwd(), "data", "profiles.json");

function readStore(): Record<string, ProfileRecord> {
  try {
    return JSON.parse(fs.readFileSync(STORE_PATH, "utf-8"));
  } catch {
    return {};
  }
}

function writeStore(store: Record<string, ProfileRecord>) {
  fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function getProfile(email: string): ProfileRecord | undefined {
  return readStore()[normalizeEmail(email)];
}

export function upsertProfile(input: { email: string; name: string; whatsapp: string }): ProfileRecord {
  const store = readStore();
  const key = normalizeEmail(input.email);
  const existing = store[key];
  const profile: ProfileRecord = {
    email: key,
    name: input.name.trim(),
    whatsapp: input.whatsapp.trim(),
    createdAt: existing?.createdAt ?? new Date().toISOString(),
    purchases: existing?.purchases ?? [],
  };
  store[key] = profile;
  writeStore(store);
  return profile;
}

const TIER_WIDTH: Record<PremiumTier, number> = { text: 1, audio: 1, both: 2 };

export function addPurchase(email: string, slug: string, tier: PremiumTier): ProfileRecord {
  const store = readStore();
  const key = normalizeEmail(email);
  const profile = store[key];
  if (!profile) throw new Error("প্রোফাইল পাওয়া যায়নি");

  const existingIndex = profile.purchases.findIndex((p) => p.slug === slug);
  const purchase: ProfilePurchase = { slug, tier, unlockedAt: new Date().toISOString() };
  if (existingIndex === -1) {
    profile.purchases.push(purchase);
  } else if (TIER_WIDTH[tier] > TIER_WIDTH[profile.purchases[existingIndex].tier]) {
    profile.purchases[existingIndex] = purchase;
  }

  store[key] = profile;
  writeStore(store);
  return profile;
}

export function getPurchaseTier(email: string, slug: string): PremiumTier | null {
  return getProfile(email)?.purchases.find((p) => p.slug === slug)?.tier ?? null;
}
