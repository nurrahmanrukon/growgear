import fs from "fs";
import path from "path";

export interface FooterGroupMeta {
  key: string;
  label: string;
}

export const FOOTER_GROUP_CATALOG: FooterGroupMeta[] = [
  { key: "about", label: "GrowGear সম্পর্কে" },
  { key: "shop", label: "কিনুন" },
  { key: "learn", label: "শিখুন" },
  { key: "support", label: "গ্রাহক সেবা" },
];

const VALID_KEYS = new Set(FOOTER_GROUP_CATALOG.map((g) => g.key));

export interface FooterSettings {
  hiddenGroups: string[];
}

const FILE_PATH = path.join(process.cwd(), "data", "footer-settings.json");
const DEFAULTS: FooterSettings = { hiddenGroups: [] };

export function getFooterSettings(): FooterSettings {
  try {
    const raw = fs.readFileSync(FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Partial<FooterSettings>;
    const hiddenGroups = Array.isArray(parsed.hiddenGroups)
      ? Array.from(new Set(parsed.hiddenGroups.filter((k) => VALID_KEYS.has(k))))
      : DEFAULTS.hiddenGroups;
    return { hiddenGroups };
  } catch {
    return DEFAULTS;
  }
}

export function setFooterSettings(update: Partial<FooterSettings>): FooterSettings {
  const current = getFooterSettings();
  const hiddenGroups =
    update.hiddenGroups !== undefined
      ? Array.from(new Set(update.hiddenGroups.filter((k) => VALID_KEYS.has(k))))
      : current.hiddenGroups;
  const next: FooterSettings = { hiddenGroups };
  fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true });
  fs.writeFileSync(FILE_PATH, JSON.stringify(next, null, 2));
  return next;
}
