import fs from "fs";
import path from "path";
import { GEAR_SUBCATEGORIES } from "@/lib/data/gear";

const VALID_SLUGS = new Set(GEAR_SUBCATEGORIES.map((c) => c.slug));

export interface GearSubcategorySettings {
  hiddenSlugs: string[];
  labelOverrides: Record<string, string>;
}

const FILE_PATH = path.join(process.cwd(), "data", "gear-subcategory-settings.json");
const DEFAULTS: GearSubcategorySettings = { hiddenSlugs: [], labelOverrides: {} };

function cleanLabelOverrides(raw: unknown): Record<string, string> {
  const result: Record<string, string> = {};
  if (!raw || typeof raw !== "object") return result;
  for (const [slug, label] of Object.entries(raw as Record<string, unknown>)) {
    if (VALID_SLUGS.has(slug) && typeof label === "string" && label.trim()) {
      result[slug] = label.trim();
    }
  }
  return result;
}

export function getGearSubcategorySettings(): GearSubcategorySettings {
  try {
    const raw = fs.readFileSync(FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Partial<GearSubcategorySettings>;
    const hiddenSlugs = Array.isArray(parsed.hiddenSlugs)
      ? Array.from(new Set(parsed.hiddenSlugs.filter((s) => VALID_SLUGS.has(s))))
      : DEFAULTS.hiddenSlugs;
    return { hiddenSlugs, labelOverrides: cleanLabelOverrides(parsed.labelOverrides) };
  } catch {
    return DEFAULTS;
  }
}

export function setGearSubcategorySettings(update: Partial<GearSubcategorySettings>): GearSubcategorySettings {
  const current = getGearSubcategorySettings();
  const next: GearSubcategorySettings = {
    hiddenSlugs:
      update.hiddenSlugs !== undefined
        ? Array.from(new Set(update.hiddenSlugs.filter((s) => VALID_SLUGS.has(s))))
        : current.hiddenSlugs,
    labelOverrides: update.labelOverrides !== undefined ? cleanLabelOverrides(update.labelOverrides) : current.labelOverrides,
  };
  fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true });
  fs.writeFileSync(FILE_PATH, JSON.stringify(next, null, 2));
  return next;
}

export function getGearSubcategoriesResolved(): { slug: string; label: string }[] {
  const settings = getGearSubcategorySettings();
  return GEAR_SUBCATEGORIES.filter((c) => !settings.hiddenSlugs.includes(c.slug)).map((c) => ({
    slug: c.slug,
    label: settings.labelOverrides[c.slug] ?? c.label,
  }));
}
