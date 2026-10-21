import fs from "fs";
import path from "path";

export interface PurchaseToastSettings {
  enabled: boolean;
}

const FILE_PATH = path.join(process.cwd(), "data", "purchase-toast-settings.json");
const DEFAULTS: PurchaseToastSettings = { enabled: true };

export function getPurchaseToastSettings(): PurchaseToastSettings {
  try {
    const raw = fs.readFileSync(FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Partial<PurchaseToastSettings>;
    return { enabled: typeof parsed.enabled === "boolean" ? parsed.enabled : DEFAULTS.enabled };
  } catch {
    return DEFAULTS;
  }
}

export function setPurchaseToastSettings(update: Partial<PurchaseToastSettings>): PurchaseToastSettings {
  const current = getPurchaseToastSettings();
  const next: PurchaseToastSettings = { enabled: update.enabled ?? current.enabled };
  fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true });
  fs.writeFileSync(FILE_PATH, JSON.stringify(next, null, 2));
  return next;
}
