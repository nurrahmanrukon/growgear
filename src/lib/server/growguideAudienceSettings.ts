import fs from "fs";
import path from "path";
import { GROWGUIDE_AUDIENCE, GrowGuideAudienceDetail } from "@/lib/data/growguideAudience";

const VALID_SLUGS = new Set(GROWGUIDE_AUDIENCE.map((a) => a.slug));
const BENEFIT_COUNT = 3;
const TESTIMONIAL_COUNT = 2;

export interface GrowGuideAudienceBenefit {
  title: string;
  body: string;
}
export interface GrowGuideAudienceTestimonial {
  name: string;
  quote: string;
  rating: number;
}
export interface GrowGuideAudienceOverride {
  label: string;
  body: string;
  heroHeading: string;
  heroSubtitle: string;
  videoCaption: string;
  benefits: GrowGuideAudienceBenefit[];
  testimonials: GrowGuideAudienceTestimonial[];
}

export type GrowGuideAudienceSettings = Record<string, GrowGuideAudienceOverride>;

const FILE_PATH = path.join(process.cwd(), "data", "growguide-audience-settings.json");

function defaultsFor(a: GrowGuideAudienceDetail): GrowGuideAudienceOverride {
  return {
    label: a.label,
    body: a.body,
    heroHeading: a.heroHeading,
    heroSubtitle: a.heroSubtitle,
    videoCaption: a.videoCaption,
    benefits: a.benefits.map((b) => ({ title: b.title, body: b.body })),
    testimonials: a.testimonials.map((t) => ({ name: t.name, quote: t.quote, rating: t.rating })),
  };
}

const DEFAULTS: GrowGuideAudienceSettings = Object.fromEntries(
  GROWGUIDE_AUDIENCE.map((a) => [a.slug, defaultsFor(a)])
);

function cleanString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function cleanBenefits(raw: unknown, fallback: GrowGuideAudienceBenefit[]): GrowGuideAudienceBenefit[] {
  if (!Array.isArray(raw) || raw.length !== BENEFIT_COUNT) return fallback;
  return raw.map((b, i) => ({
    title: cleanString((b as Partial<GrowGuideAudienceBenefit>)?.title, fallback[i].title),
    body: cleanString((b as Partial<GrowGuideAudienceBenefit>)?.body, fallback[i].body),
  }));
}

function cleanTestimonials(
  raw: unknown,
  fallback: GrowGuideAudienceTestimonial[]
): GrowGuideAudienceTestimonial[] {
  if (!Array.isArray(raw) || raw.length !== TESTIMONIAL_COUNT) return fallback;
  return raw.map((t, i) => {
    const candidate = t as Partial<GrowGuideAudienceTestimonial>;
    const rating =
      typeof candidate?.rating === "number" && Number.isFinite(candidate.rating) ? candidate.rating : fallback[i].rating;
    return {
      name: cleanString(candidate?.name, fallback[i].name),
      quote: cleanString(candidate?.quote, fallback[i].quote),
      rating,
    };
  });
}

function cleanOverride(raw: unknown, fallback: GrowGuideAudienceOverride): GrowGuideAudienceOverride {
  const candidate = (raw && typeof raw === "object" ? raw : {}) as Partial<GrowGuideAudienceOverride>;
  return {
    label: cleanString(candidate.label, fallback.label),
    body: cleanString(candidate.body, fallback.body),
    heroHeading: cleanString(candidate.heroHeading, fallback.heroHeading),
    heroSubtitle: cleanString(candidate.heroSubtitle, fallback.heroSubtitle),
    videoCaption: cleanString(candidate.videoCaption, fallback.videoCaption),
    benefits: cleanBenefits(candidate.benefits, fallback.benefits),
    testimonials: cleanTestimonials(candidate.testimonials, fallback.testimonials),
  };
}

export function getGrowGuideAudienceSettings(): GrowGuideAudienceSettings {
  let parsed: Partial<Record<string, unknown>> = {};
  try {
    parsed = JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"));
  } catch {
    parsed = {};
  }
  const result: GrowGuideAudienceSettings = {};
  for (const slug of VALID_SLUGS) {
    result[slug] = cleanOverride(parsed[slug], DEFAULTS[slug]);
  }
  return result;
}

export function setGrowGuideAudienceSettings(update: Partial<GrowGuideAudienceSettings>): GrowGuideAudienceSettings {
  const current = getGrowGuideAudienceSettings();
  const next: GrowGuideAudienceSettings = {};
  for (const slug of VALID_SLUGS) {
    next[slug] = update[slug] !== undefined ? cleanOverride(update[slug], current[slug]) : current[slug];
  }
  fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true });
  fs.writeFileSync(FILE_PATH, JSON.stringify(next, null, 2));
  return next;
}

export interface ResolvedGrowGuideAudience extends GrowGuideAudienceDetail {
  label: string;
  body: string;
  heroHeading: string;
  heroSubtitle: string;
  videoCaption: string;
  benefits: GrowGuideAudienceBenefit[];
  testimonials: GrowGuideAudienceTestimonial[];
}

/** All audiences with text overrides applied, keeping slug/icon (structural) from the data file. */
export function getGrowGuideAudiencesResolved(): ResolvedGrowGuideAudience[] {
  const settings = getGrowGuideAudienceSettings();
  return GROWGUIDE_AUDIENCE.map((a) => ({ ...a, ...settings[a.slug] }));
}

export function getGrowGuideAudienceResolved(slug: string): ResolvedGrowGuideAudience | undefined {
  return getGrowGuideAudiencesResolved().find((a) => a.slug === slug);
}
