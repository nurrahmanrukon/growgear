import { TOPICS, SEGMENTS } from "./blog";
import { BlogTopicSlug } from "@/lib/types";

export interface SegmentMeta {
  slug: string;
  label: string;
  topicSlug: BlogTopicSlug;
  topicLabel: string;
}

/** Flattened list of all 30 segments (across the 10 blog topics), reused to tag products
 *  (books/ebooks/gear) by subject so the home page can group them by real-world interest
 *  instead of by category. */
export const ALL_SEGMENTS: SegmentMeta[] = TOPICS.flatMap((topic) =>
  SEGMENTS[topic.slug].map((seg) => ({
    slug: seg.slug,
    label: seg.label,
    topicSlug: topic.slug,
    topicLabel: topic.label,
  }))
);

const SEGMENT_BY_SLUG = new Map(ALL_SEGMENTS.map((s) => [s.slug, s]));

export function getSegmentMeta(slug: string): SegmentMeta | undefined {
  return SEGMENT_BY_SLUG.get(slug);
}
