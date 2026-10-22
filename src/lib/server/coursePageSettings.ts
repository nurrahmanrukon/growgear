import fs from "fs";
import path from "path";

export interface CoursePageSettings {
  heading: string;
  introBefore: string;
  platformName: string;
  platformUrl: string;
  introAfter: string;
  enrollCtaLabel: string;
}

const FILE_PATH = path.join(process.cwd(), "data", "course-page-settings.json");

const DEFAULTS: CoursePageSettings = {
  heading: "অনলাইন কোর্স",
  introBefore: "GrowGear-এর সব কোর্স পরিচালিত ও এনরোলমেন্ট সম্পন্ন হয় আমাদের পার্টনার লার্নিং প্ল্যাটফর্ম",
  platformName: "enrich.com.bd",
  platformUrl: "https://enrich.com.bd",
  introAfter: 'এ। নিচের কোনো কোর্সে "এনরোল করুন" চাপলে আপনি enrich.com.bd তে চলে যাবেন।',
  enrollCtaLabel: "এনরোল করুন",
};

function cleanString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

export function getCoursePageSettings(): CoursePageSettings {
  try {
    const raw = fs.readFileSync(FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Partial<CoursePageSettings>;
    return {
      heading: cleanString(parsed.heading, DEFAULTS.heading),
      introBefore: cleanString(parsed.introBefore, DEFAULTS.introBefore),
      platformName: cleanString(parsed.platformName, DEFAULTS.platformName),
      platformUrl: cleanString(parsed.platformUrl, DEFAULTS.platformUrl),
      introAfter: cleanString(parsed.introAfter, DEFAULTS.introAfter),
      enrollCtaLabel: cleanString(parsed.enrollCtaLabel, DEFAULTS.enrollCtaLabel),
    };
  } catch {
    return DEFAULTS;
  }
}

export function setCoursePageSettings(update: Partial<CoursePageSettings>): CoursePageSettings {
  const current = getCoursePageSettings();
  const next: CoursePageSettings = {
    heading: update.heading !== undefined ? cleanString(update.heading, current.heading) : current.heading,
    introBefore:
      update.introBefore !== undefined ? cleanString(update.introBefore, current.introBefore) : current.introBefore,
    platformName:
      update.platformName !== undefined ? cleanString(update.platformName, current.platformName) : current.platformName,
    platformUrl:
      update.platformUrl !== undefined ? cleanString(update.platformUrl, current.platformUrl) : current.platformUrl,
    introAfter:
      update.introAfter !== undefined ? cleanString(update.introAfter, current.introAfter) : current.introAfter,
    enrollCtaLabel:
      update.enrollCtaLabel !== undefined
        ? cleanString(update.enrollCtaLabel, current.enrollCtaLabel)
        : current.enrollCtaLabel,
  };
  fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true });
  fs.writeFileSync(FILE_PATH, JSON.stringify(next, null, 2));
  return next;
}
