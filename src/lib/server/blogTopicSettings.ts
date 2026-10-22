import fs from "fs";
import path from "path";
import { TOPICS, SEGMENTS } from "@/lib/data/blog";
import { BlogTopicSlug } from "@/lib/types";

const VALID_SLUGS = new Set(TOPICS.map((t) => t.slug));
const DEFAULT_ORDER: BlogTopicSlug[] = TOPICS.map((t) => t.slug);
const ALL_SEGMENT_SLUGS = new Set(Object.values(SEGMENTS).flatMap((segs) => segs.map((s) => s.slug)));

export interface BlogTopicSettings {
  order: BlogTopicSlug[];
  hiddenTopics: BlogTopicSlug[];
  topicLabelOverrides: Partial<Record<BlogTopicSlug, string>>;
  topicDescriptionOverrides: Partial<Record<BlogTopicSlug, string>>;
  hiddenSegments: string[];
  segmentLabelOverrides: Record<string, string>;
}

const FILE_PATH = path.join(process.cwd(), "data", "blog-topic-settings.json");

const DEFAULTS: BlogTopicSettings = {
  order: DEFAULT_ORDER,
  hiddenTopics: [],
  topicLabelOverrides: {},
  topicDescriptionOverrides: {},
  hiddenSegments: [],
  segmentLabelOverrides: {},
};

function isOrderPermutation(arr: unknown): arr is BlogTopicSlug[] {
  if (!Array.isArray(arr) || arr.length !== DEFAULT_ORDER.length) return false;
  const seen = new Set(arr);
  if (seen.size !== DEFAULT_ORDER.length) return false;
  return arr.every((s) => typeof s === "string" && VALID_SLUGS.has(s as BlogTopicSlug));
}

function cleanTopicSlugs(arr: unknown): BlogTopicSlug[] {
  if (!Array.isArray(arr)) return [];
  return Array.from(
    new Set(arr.filter((s): s is BlogTopicSlug => typeof s === "string" && VALID_SLUGS.has(s as BlogTopicSlug)))
  );
}

function cleanSegmentSlugs(arr: unknown): string[] {
  if (!Array.isArray(arr)) return [];
  return Array.from(new Set(arr.filter((s): s is string => typeof s === "string" && ALL_SEGMENT_SLUGS.has(s))));
}

function cleanTopicTextOverrides(raw: unknown): Partial<Record<BlogTopicSlug, string>> {
  const result: Partial<Record<BlogTopicSlug, string>> = {};
  if (!raw || typeof raw !== "object") return result;
  for (const [slug, text] of Object.entries(raw as Record<string, unknown>)) {
    if (VALID_SLUGS.has(slug as BlogTopicSlug) && typeof text === "string" && text.trim()) {
      result[slug as BlogTopicSlug] = text.trim();
    }
  }
  return result;
}

function cleanSegmentLabelOverrides(raw: unknown): Record<string, string> {
  const result: Record<string, string> = {};
  if (!raw || typeof raw !== "object") return result;
  for (const [slug, label] of Object.entries(raw as Record<string, unknown>)) {
    if (ALL_SEGMENT_SLUGS.has(slug) && typeof label === "string" && label.trim()) {
      result[slug] = label.trim();
    }
  }
  return result;
}

export function getBlogTopicSettings(): BlogTopicSettings {
  try {
    const raw = fs.readFileSync(FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Partial<BlogTopicSettings>;
    return {
      order: isOrderPermutation(parsed.order) ? parsed.order : DEFAULTS.order,
      hiddenTopics: cleanTopicSlugs(parsed.hiddenTopics),
      topicLabelOverrides: cleanTopicTextOverrides(parsed.topicLabelOverrides),
      topicDescriptionOverrides: cleanTopicTextOverrides(parsed.topicDescriptionOverrides),
      hiddenSegments: cleanSegmentSlugs(parsed.hiddenSegments),
      segmentLabelOverrides: cleanSegmentLabelOverrides(parsed.segmentLabelOverrides),
    };
  } catch {
    return DEFAULTS;
  }
}

export function setBlogTopicSettings(update: Partial<BlogTopicSettings>): BlogTopicSettings {
  const current = getBlogTopicSettings();
  const next: BlogTopicSettings = {
    order: update.order !== undefined && isOrderPermutation(update.order) ? update.order : current.order,
    hiddenTopics: update.hiddenTopics !== undefined ? cleanTopicSlugs(update.hiddenTopics) : current.hiddenTopics,
    topicLabelOverrides:
      update.topicLabelOverrides !== undefined
        ? cleanTopicTextOverrides(update.topicLabelOverrides)
        : current.topicLabelOverrides,
    topicDescriptionOverrides:
      update.topicDescriptionOverrides !== undefined
        ? cleanTopicTextOverrides(update.topicDescriptionOverrides)
        : current.topicDescriptionOverrides,
    hiddenSegments:
      update.hiddenSegments !== undefined ? cleanSegmentSlugs(update.hiddenSegments) : current.hiddenSegments,
    segmentLabelOverrides:
      update.segmentLabelOverrides !== undefined
        ? cleanSegmentLabelOverrides(update.segmentLabelOverrides)
        : current.segmentLabelOverrides,
  };
  fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true });
  fs.writeFileSync(FILE_PATH, JSON.stringify(next, null, 2));
  return next;
}

export interface ResolvedTopic {
  slug: BlogTopicSlug;
  label: string;
  description: string;
}

/** All topics (including hidden ones), in admin-chosen order, with text overrides applied —
 *  used where a topic must still resolve even if hidden from nav (e.g. a post whose topic
 *  was hidden later, or a direct URL visit). */
export function getAllTopicsResolved(): ResolvedTopic[] {
  const settings = getBlogTopicSettings();
  return settings.order.map((slug) => {
    const base = TOPICS.find((t) => t.slug === slug)!;
    return {
      slug,
      label: settings.topicLabelOverrides[slug] ?? base.label,
      description: settings.topicDescriptionOverrides[slug] ?? base.description,
    };
  });
}

/** Visible topics only, for nav/tile/section surfaces. */
export function getVisibleTopicsResolved(): ResolvedTopic[] {
  const settings = getBlogTopicSettings();
  return getAllTopicsResolved().filter((t) => !settings.hiddenTopics.includes(t.slug));
}

export interface ResolvedSegment {
  slug: string;
  label: string;
}

/** Visible segments for one topic, with label overrides applied — for the segment filter pills. */
export function getVisibleSegmentsForTopic(topicSlug: BlogTopicSlug): ResolvedSegment[] {
  const settings = getBlogTopicSettings();
  return (SEGMENTS[topicSlug] ?? [])
    .filter((s) => !settings.hiddenSegments.includes(s.slug))
    .map((s) => ({ slug: s.slug, label: settings.segmentLabelOverrides[s.slug] ?? s.label }));
}

export function getSegmentLabelResolved(segmentSlug: string, fallbackLabel: string): string {
  const settings = getBlogTopicSettings();
  return settings.segmentLabelOverrides[segmentSlug] ?? fallbackLabel;
}

export function isSegmentHidden(segmentSlug: string): boolean {
  return getBlogTopicSettings().hiddenSegments.includes(segmentSlug);
}
