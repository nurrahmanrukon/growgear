import fs from "fs";
import path from "path";
import { TOPICS } from "@/lib/data/blog";
import { BlogTopicSlug } from "@/lib/types";

const VALID_SLUGS = new Set(TOPICS.map((t) => t.slug));
const DEFAULT_ORDER: BlogTopicSlug[] = TOPICS.map((t) => t.slug);

export interface BlogTopicOrderSettings {
  order: BlogTopicSlug[];
}

const FILE_PATH = path.join(process.cwd(), "data", "blog-topic-order.json");

function isPermutation(arr: unknown): arr is BlogTopicSlug[] {
  if (!Array.isArray(arr) || arr.length !== DEFAULT_ORDER.length) return false;
  const seen = new Set(arr);
  if (seen.size !== DEFAULT_ORDER.length) return false;
  return arr.every((s) => typeof s === "string" && VALID_SLUGS.has(s as BlogTopicSlug));
}

export function getBlogTopicOrderSettings(): BlogTopicOrderSettings {
  try {
    const raw = fs.readFileSync(FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Partial<BlogTopicOrderSettings>;
    return { order: isPermutation(parsed.order) ? parsed.order : DEFAULT_ORDER };
  } catch {
    return { order: DEFAULT_ORDER };
  }
}

export function setBlogTopicOrderSettings(update: Partial<BlogTopicOrderSettings>): BlogTopicOrderSettings {
  const current = getBlogTopicOrderSettings();
  const order = update.order !== undefined && isPermutation(update.order) ? update.order : current.order;
  const next: BlogTopicOrderSettings = { order };
  fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true });
  fs.writeFileSync(FILE_PATH, JSON.stringify(next, null, 2));
  return next;
}

export function getOrderedTopics(): typeof TOPICS {
  const { order } = getBlogTopicOrderSettings();
  return order.map((slug) => TOPICS.find((t) => t.slug === slug)).filter(Boolean) as typeof TOPICS;
}
