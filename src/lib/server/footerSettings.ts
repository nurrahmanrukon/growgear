import fs from "fs";
import path from "path";
import { FOOTER_GROUP_CATALOG, FOOTER_LINK_CATALOG, FooterGroupMeta } from "@/lib/data/footerLinks";

export type { FooterGroupMeta };
export { FOOTER_GROUP_CATALOG };

const VALID_KEYS = new Set(FOOTER_GROUP_CATALOG.map((g) => g.key));
const DEFAULT_GROUP_ORDER = FOOTER_GROUP_CATALOG.map((g) => g.key);
const DEFAULT_LINK_ORDER: Record<string, number[]> = Object.fromEntries(
  Object.entries(FOOTER_LINK_CATALOG).map(([key, links]) => [key, links.map((_, i) => i)]),
);

export interface FooterSettings {
  hiddenGroups: string[];
  groupOrder: string[];
  linkOrder: Record<string, number[]>;
  hiddenLinks: Record<string, number[]>;
  linkLabelOverrides: Record<string, Record<number, string>>;
}

const FILE_PATH = path.join(process.cwd(), "data", "footer-settings.json");
const DEFAULTS: FooterSettings = {
  hiddenGroups: [],
  groupOrder: DEFAULT_GROUP_ORDER,
  linkOrder: DEFAULT_LINK_ORDER,
  hiddenLinks: {},
  linkLabelOverrides: {},
};

function isPermutation(arr: unknown, validSet: Set<string> | number): boolean {
  if (!Array.isArray(arr)) return false;
  if (typeof validSet === "number") {
    if (arr.length !== validSet) return false;
    const seen = new Set(arr);
    if (seen.size !== validSet) return false;
    for (const n of arr) {
      if (typeof n !== "number" || n < 0 || n >= validSet) return false;
    }
    return true;
  }
  if (arr.length !== validSet.size) return false;
  const seen = new Set(arr);
  if (seen.size !== validSet.size) return false;
  return arr.every((k) => typeof k === "string" && validSet.has(k));
}

function normalizeLinkOrder(input: unknown): Record<string, number[]> {
  const result: Record<string, number[]> = {};
  const parsed = (input && typeof input === "object" ? (input as Record<string, unknown>) : {}) as Record<
    string,
    unknown
  >;
  for (const [key, links] of Object.entries(FOOTER_LINK_CATALOG)) {
    const candidate = parsed[key];
    result[key] = isPermutation(candidate, links.length) ? (candidate as number[]) : DEFAULT_LINK_ORDER[key];
  }
  return result;
}

function normalizeHiddenLinks(input: unknown): Record<string, number[]> {
  const result: Record<string, number[]> = {};
  const parsed = (input && typeof input === "object" ? (input as Record<string, unknown>) : {}) as Record<
    string,
    unknown
  >;
  for (const [key, links] of Object.entries(FOOTER_LINK_CATALOG)) {
    const candidate = parsed[key];
    result[key] = Array.isArray(candidate)
      ? Array.from(new Set(candidate.filter((n): n is number => typeof n === "number" && n >= 0 && n < links.length)))
      : [];
  }
  return result;
}

function normalizeLinkLabelOverrides(input: unknown): Record<string, Record<number, string>> {
  const result: Record<string, Record<number, string>> = {};
  const parsed = (input && typeof input === "object" ? (input as Record<string, unknown>) : {}) as Record<
    string,
    unknown
  >;
  for (const [key, links] of Object.entries(FOOTER_LINK_CATALOG)) {
    const candidate = parsed[key];
    const cleaned: Record<number, string> = {};
    if (candidate && typeof candidate === "object") {
      for (const [idxStr, label] of Object.entries(candidate as Record<string, unknown>)) {
        const idx = Number(idxStr);
        if (Number.isInteger(idx) && idx >= 0 && idx < links.length && typeof label === "string" && label.trim()) {
          cleaned[idx] = label.trim();
        }
      }
    }
    result[key] = cleaned;
  }
  return result;
}

export function getFooterSettings(): FooterSettings {
  try {
    const raw = fs.readFileSync(FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Partial<FooterSettings>;
    const hiddenGroups = Array.isArray(parsed.hiddenGroups)
      ? Array.from(new Set(parsed.hiddenGroups.filter((k) => VALID_KEYS.has(k))))
      : DEFAULTS.hiddenGroups;
    const groupOrder = isPermutation(parsed.groupOrder, VALID_KEYS)
      ? (parsed.groupOrder as string[])
      : DEFAULT_GROUP_ORDER;
    const linkOrder = normalizeLinkOrder(parsed.linkOrder);
    const hiddenLinks = normalizeHiddenLinks(parsed.hiddenLinks);
    const linkLabelOverrides = normalizeLinkLabelOverrides(parsed.linkLabelOverrides);
    return { hiddenGroups, groupOrder, linkOrder, hiddenLinks, linkLabelOverrides };
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
  const groupOrder =
    update.groupOrder !== undefined && isPermutation(update.groupOrder, VALID_KEYS)
      ? update.groupOrder
      : current.groupOrder;
  const linkOrder = update.linkOrder !== undefined ? normalizeLinkOrder(update.linkOrder) : current.linkOrder;
  const hiddenLinks = update.hiddenLinks !== undefined ? normalizeHiddenLinks(update.hiddenLinks) : current.hiddenLinks;
  const linkLabelOverrides =
    update.linkLabelOverrides !== undefined
      ? normalizeLinkLabelOverrides(update.linkLabelOverrides)
      : current.linkLabelOverrides;
  const next: FooterSettings = { hiddenGroups, groupOrder, linkOrder, hiddenLinks, linkLabelOverrides };
  fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true });
  fs.writeFileSync(FILE_PATH, JSON.stringify(next, null, 2));
  return next;
}
