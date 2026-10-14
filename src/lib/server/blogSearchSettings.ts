import fs from "fs";
import path from "path";

export interface BlogSearchSettings {
  enabled: boolean;
}

const FILE_PATH = path.join(process.cwd(), "data", "blog-search-settings.json");

// Off by default — turn on once there are enough posts for search to be useful.
const DEFAULTS: BlogSearchSettings = { enabled: false };

export function getBlogSearchSettings(): BlogSearchSettings {
  try {
    const raw = fs.readFileSync(FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Partial<BlogSearchSettings>;
    return { enabled: typeof parsed.enabled === "boolean" ? parsed.enabled : DEFAULTS.enabled };
  } catch {
    return DEFAULTS;
  }
}

export function setBlogSearchSettings(update: Partial<BlogSearchSettings>): BlogSearchSettings {
  const current = getBlogSearchSettings();
  const next: BlogSearchSettings = { enabled: update.enabled ?? current.enabled };
  fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true });
  fs.writeFileSync(FILE_PATH, JSON.stringify(next, null, 2));
  return next;
}
