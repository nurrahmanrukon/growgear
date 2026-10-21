import fs from "fs";
import path from "path";

export interface NewsletterSettings {
  /** Whether the newsletter subscribe box shows on blog pages at all. */
  enabled: boolean;
  /** Slug of the (normally paid) premium blog post sent free to every new subscriber. Empty = none picked yet. */
  premiumBlogSlug: string;
}

const FILE_PATH = path.join(process.cwd(), "data", "newsletter-settings.json");

const DEFAULTS: NewsletterSettings = {
  enabled: true,
  premiumBlogSlug: "",
};

export function getNewsletterSettings(): NewsletterSettings {
  try {
    const raw = fs.readFileSync(FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Partial<NewsletterSettings>;
    return {
      enabled: typeof parsed.enabled === "boolean" ? parsed.enabled : DEFAULTS.enabled,
      premiumBlogSlug: typeof parsed.premiumBlogSlug === "string" ? parsed.premiumBlogSlug.trim() : DEFAULTS.premiumBlogSlug,
    };
  } catch {
    return DEFAULTS;
  }
}

export function setNewsletterSettings(update: Partial<NewsletterSettings>): NewsletterSettings {
  const current = getNewsletterSettings();
  const next: NewsletterSettings = {
    enabled: update.enabled ?? current.enabled,
    premiumBlogSlug: update.premiumBlogSlug !== undefined ? update.premiumBlogSlug.trim() : current.premiumBlogSlug,
  };
  fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true });
  fs.writeFileSync(FILE_PATH, JSON.stringify(next, null, 2));
  return next;
}
