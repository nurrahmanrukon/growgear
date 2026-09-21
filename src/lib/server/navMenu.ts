import fs from "fs";
import path from "path";

export interface NavMenuEntry {
  key: string;
  label: string;
  href: string;
  hidden: boolean;
}

export const NAV_MENU_CATALOG: { key: string; label: string; href: string }[] = [
  { key: "home", label: "হোম", href: "/" },
  { key: "book", label: "বই", href: "/books" },
  { key: "ebook", label: "ইবুক", href: "/ebooks" },
  { key: "gear", label: "গিয়ার", href: "/gear" },
  { key: "course", label: "কোর্স", href: "/course" },
  { key: "blog", label: "ব্লগ", href: "/blog" },
  { key: "growguide", label: "GrowGuide", href: "/growguide" },
  { key: "decisionmaster", label: "ডিসিশনমাস্টার", href: "/decisionmaster" },
];

const CATALOG_KEYS = NAV_MENU_CATALOG.map((c) => c.key);
const FILE_PATH = path.join(process.cwd(), "data", "nav-menu.json");

interface StoredConfig {
  order: string[];
  hidden: string[];
}

function readConfig(): StoredConfig {
  try {
    const raw = fs.readFileSync(FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Partial<StoredConfig>;
    return {
      order: Array.isArray(parsed.order) ? parsed.order : CATALOG_KEYS,
      hidden: Array.isArray(parsed.hidden) ? parsed.hidden : [],
    };
  } catch {
    return { order: CATALOG_KEYS, hidden: [] };
  }
}

function writeConfig(config: StoredConfig) {
  fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true });
  fs.writeFileSync(FILE_PATH, JSON.stringify(config, null, 2));
}

function normalizedOrder(order: string[]): string[] {
  const known = order.filter((k) => CATALOG_KEYS.includes(k));
  for (const k of CATALOG_KEYS) {
    if (!known.includes(k)) known.push(k);
  }
  return known;
}

export function getAllNavMenuEntries(): NavMenuEntry[] {
  const config = readConfig();
  const order = normalizedOrder(config.order);
  return order.map((key) => {
    const meta = NAV_MENU_CATALOG.find((c) => c.key === key)!;
    return { key, label: meta.label, href: meta.href, hidden: config.hidden.includes(key) };
  });
}

export function getVisibleOrderedKeys(): string[] {
  const config = readConfig();
  const order = normalizedOrder(config.order);
  return order.filter((key) => !config.hidden.includes(key));
}

export function setNavMenuOrder(order: string[]) {
  const config = readConfig();
  const valid = order.filter((k) => CATALOG_KEYS.includes(k));
  if (valid.length !== CATALOG_KEYS.length || new Set(valid).size !== CATALOG_KEYS.length) {
    throw new Error("অবৈধ মেনু অর্ডার");
  }
  writeConfig({ ...config, order: valid });
}

export function setNavItemHidden(key: string, hidden: boolean) {
  if (!CATALOG_KEYS.includes(key)) {
    throw new Error("অজানা মেনু আইটেম");
  }
  const config = readConfig();
  const hiddenSet = new Set(config.hidden);
  if (hidden) hiddenSet.add(key);
  else hiddenSet.delete(key);

  const order = normalizedOrder(config.order);
  const stillVisible = order.filter((k) => !hiddenSet.has(k));
  if (stillVisible.length === 0) {
    throw new Error("অন্তত একটি মেনু আইটেম দেখানো থাকতে হবে");
  }

  writeConfig({ order: config.order, hidden: Array.from(hiddenSet) });
}

export function resetNavMenu() {
  writeConfig({ order: CATALOG_KEYS, hidden: [] });
}
