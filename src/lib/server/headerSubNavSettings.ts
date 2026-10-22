import fs from "fs";
import path from "path";
import { HEADER_SUBNAV_CATALOG, SubNavItem } from "@/lib/data/headerSubNav";

const ALL_HREFS = new Set(Object.values(HEADER_SUBNAV_CATALOG).flatMap((items) => items.map((i) => i.href)));

export interface HeaderSubNavSettings {
  hiddenHrefs: string[];
  labelOverrides: Record<string, string>;
}

const FILE_PATH = path.join(process.cwd(), "data", "header-subnav-settings.json");
const DEFAULTS: HeaderSubNavSettings = { hiddenHrefs: [], labelOverrides: {} };

function cleanLabelOverrides(raw: unknown): Record<string, string> {
  const result: Record<string, string> = {};
  if (!raw || typeof raw !== "object") return result;
  for (const [href, label] of Object.entries(raw as Record<string, unknown>)) {
    if (ALL_HREFS.has(href) && typeof label === "string" && label.trim()) {
      result[href] = label.trim();
    }
  }
  return result;
}

export function getHeaderSubNavSettings(): HeaderSubNavSettings {
  try {
    const raw = fs.readFileSync(FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Partial<HeaderSubNavSettings>;
    const hiddenHrefs = Array.isArray(parsed.hiddenHrefs)
      ? Array.from(new Set(parsed.hiddenHrefs.filter((h) => ALL_HREFS.has(h))))
      : DEFAULTS.hiddenHrefs;
    return { hiddenHrefs, labelOverrides: cleanLabelOverrides(parsed.labelOverrides) };
  } catch {
    return DEFAULTS;
  }
}

export function setHeaderSubNavSettings(update: Partial<HeaderSubNavSettings>): HeaderSubNavSettings {
  const current = getHeaderSubNavSettings();
  const next: HeaderSubNavSettings = {
    hiddenHrefs:
      update.hiddenHrefs !== undefined
        ? Array.from(new Set(update.hiddenHrefs.filter((h) => ALL_HREFS.has(h))))
        : current.hiddenHrefs,
    labelOverrides: update.labelOverrides !== undefined ? cleanLabelOverrides(update.labelOverrides) : current.labelOverrides,
  };
  fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true });
  fs.writeFileSync(FILE_PATH, JSON.stringify(next, null, 2));
  return next;
}

export function resolveHeaderSubNav(key: string): SubNavItem[] {
  const settings = getHeaderSubNavSettings();
  const items = HEADER_SUBNAV_CATALOG[key] ?? [];
  return items
    .filter((i) => !settings.hiddenHrefs.includes(i.href))
    .map((i) => ({ href: i.href, label: settings.labelOverrides[i.href] ?? i.label }));
}
